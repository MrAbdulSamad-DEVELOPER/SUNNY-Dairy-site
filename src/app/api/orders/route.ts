export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { checkoutSchema } from '@/lib/validations';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rateLimit = checkRateLimit(`order_${ip}`, 10, 60000);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Too many order requests from your network. Please wait a minute before trying again.',
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const validatedData = checkoutSchema.parse(body);

    // 1. Authoritative price and product resolution from DB
    const productIds = validatedData.items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isActive: true,
      },
      include: {
        variants: true,
      },
    });

    if (dbProducts.length === 0) {
      return NextResponse.json(
        { error: 'Selected products are currently unavailable.' },
        { status: 400 }
      );
    }

    let calculatedSubtotal = 0;
    let priceConfirmationRequired = false;

    interface PreparedItem {
      productId: string;
      productNameSnapshot: string;
      selectedVariant: string;
      quantity: number;
      unitPriceSnapshot: number | null;
      priceConfirmationRequired: boolean;
    }

    const preparedItems: PreparedItem[] = [];

    for (const item of validatedData.items) {
      const dbProduct = dbProducts.find((p) => p.id === item.productId);
      if (!dbProduct) {
        return NextResponse.json(
          { error: `Product with ID ${item.productId} not found or inactive.` },
          { status: 400 }
        );
      }

      const variant = dbProduct.variants.find((v) => v.size === item.selectedVariant);
      if (!variant) {
        return NextResponse.json(
          { error: `Selected size "${item.selectedVariant}" is not available for ${dbProduct.name}.` },
          { status: 400 }
        );
      }

      if (!variant.isAvailable) {
        return NextResponse.json(
          { error: `${dbProduct.name} (${variant.size}) is currently out of stock.` },
          { status: 400 }
        );
      }

      const isUnpriced = variant.priceType === 'ON_REQUEST' || variant.price === null;
      if (isUnpriced) {
        priceConfirmationRequired = true;
      } else {
        calculatedSubtotal += variant.price! * item.quantity;
      }

      preparedItems.push({
        productId: dbProduct.id,
        productNameSnapshot: dbProduct.name,
        selectedVariant: variant.size,
        quantity: item.quantity,
        unitPriceSnapshot: isUnpriced ? null : variant.price,
        priceConfirmationRequired: isUnpriced,
      });
    }

    // 2. Resolve Delivery Zone Charges
    let deliveryCharges = 0;
    try {
      const zones = await prisma.deliveryZone.findMany({
        where: { isActive: true },
      });

      // Match area or city
      const matchedZone = zones.find(
        (z) =>
          validatedData.area.toLowerCase().includes(z.areaName.toLowerCase()) ||
          z.areaName.toLowerCase().includes(validatedData.area.toLowerCase())
      );

      if (matchedZone) {
        // Check free delivery threshold
        if (
          matchedZone.freeDeliveryThreshold &&
          calculatedSubtotal >= matchedZone.freeDeliveryThreshold
        ) {
          deliveryCharges = 0;
        } else {
          deliveryCharges = matchedZone.deliveryFee;
        }
      } else if (zones.length > 0) {
        // Standard delivery zone fallback
        const defaultZone = zones[0];
        if (
          defaultZone.freeDeliveryThreshold &&
          calculatedSubtotal >= defaultZone.freeDeliveryThreshold
        ) {
          deliveryCharges = 0;
        } else {
          deliveryCharges = defaultZone.deliveryFee;
        }
      }
    } catch (e) {
      console.warn('Could not lookup delivery zone, using 0', e);
    }

    // 3. Generate unique order number (e.g. SUNNY-2026-1042) & tracking code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const timestampPart = Date.now().toString().slice(-4);
    const orderNumber = `SUNNY-2026-${timestampPart}${randomSuffix.toString().slice(-2)}`;
    const trackingCode = `TRK-${timestampPart}-${randomSuffix.toString().slice(-2)}`;

    // 5. Upsert or create Customer record
    let customer = await prisma.customer.findFirst({
      where: { phone: validatedData.customerPhone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          fullName: validatedData.customerName,
          phone: validatedData.customerPhone,
          whatsapp: validatedData.customerWhatsapp,
        },
      });
    } else {
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          fullName: validatedData.customerName,
          whatsapp: validatedData.customerWhatsapp,
        },
      });
    }

    // 6. Validate Advance Payment fields if selected
    if (validatedData.paymentMethod === 'ADVANCE_UBL') {
      if (!validatedData.senderName || !validatedData.senderName.trim()) {
        return NextResponse.json(
          { error: 'Please enter the bank account sender name for advance transfer verification.' },
          { status: 400 }
        );
      }
      if (!validatedData.transactionReference || !validatedData.transactionReference.trim()) {
        return NextResponse.json(
          { error: 'Please enter the transaction reference / TID number.' },
          { status: 400 }
        );
      }
      if (!validatedData.receiptImageUrl || !validatedData.receiptImageUrl.trim()) {
        return NextResponse.json(
          { error: 'Please upload a screenshot or photo of your UBL bank transfer receipt.' },
          { status: 400 }
        );
      }
    }

    // 6. Calculate final total
    const finalCalculatedTotal = priceConfirmationRequired
      ? null
      : Math.max(0, calculatedSubtotal + deliveryCharges);

    const initialStatus = priceConfirmationRequired
      ? 'PRICE_CONFIRMATION_REQUIRED'
      : 'PENDING';

    const initialPaymentStatus =
      validatedData.paymentMethod === 'ADVANCE_UBL'
        ? 'PAYMENT_SUBMITTED'
        : 'AWAITING_PAYMENT';

    const payableAmount = finalCalculatedTotal !== null ? finalCalculatedTotal : calculatedSubtotal;

    // 7. Create Order, OrderItems, and Payment record transactionally
    const order = await prisma.order.create({
      data: {
        orderNumber,
        trackingCode,
        customerId: customer.id,
        customerName: validatedData.customerName,
        customerPhone: validatedData.customerPhone,
        customerWhatsapp: validatedData.customerWhatsapp,
        deliveryAddress: validatedData.deliveryAddress,
        city: validatedData.city,
        area: validatedData.area,
        deliveryInstructions: validatedData.deliveryInstructions || null,
        orderStatus: initialStatus,
        paymentMethod: validatedData.paymentMethod,
        paymentStatus: initialPaymentStatus,
        subtotal: calculatedSubtotal,
        deliveryCharges,
        discountAmount: 0,
        couponCode: null,
        finalTotal: finalCalculatedTotal,
        priceConfirmationRequired,
        items: {
          create: preparedItems.map((item) => ({
            productId: item.productId,
            productNameSnapshot: item.productNameSnapshot,
            selectedVariant: item.selectedVariant,
            quantity: item.quantity,
            unitPriceSnapshot: item.unitPriceSnapshot,
            priceConfirmationRequired: item.priceConfirmationRequired,
          })),
        },
        payments: {
          create: [
            {
              paymentMethod: validatedData.paymentMethod,
              amount: payableAmount,
              senderName: validatedData.senderName || null,
              transactionReference: validatedData.transactionReference || null,
              receiptImageUrl: validatedData.receiptImageUrl || null,
              paymentStatus: initialPaymentStatus,
              adminNotes:
                validatedData.paymentMethod === 'ADVANCE_UBL'
                  ? 'UBL Bank Transfer receipt submitted by customer. Awaiting manual admin verification.'
                  : 'Direct WhatsApp order awaiting communication.',
            },
          ],
        },
      },
      include: {
        items: true,
        payments: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          orderNumber: order.orderNumber,
          trackingCode: order.trackingCode,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          customerWhatsapp: order.customerWhatsapp,
          deliveryAddress: order.deliveryAddress,
          city: order.city,
          area: order.area,
          orderStatus: order.orderStatus,
          paymentMethod: order.paymentMethod,
          subtotal: order.subtotal,
          deliveryCharges: order.deliveryCharges,
          discountAmount: order.discountAmount,
          finalTotal: order.finalTotal,
          priceConfirmationRequired: order.priceConfirmationRequired,
          items: order.items,
          createdAt: order.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Order creation error:', error);
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'An unexpected error occurred while placing your order.' },
      { status: 500 }
    );
  }
}
