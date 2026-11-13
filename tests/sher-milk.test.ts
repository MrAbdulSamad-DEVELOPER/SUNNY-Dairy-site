import { describe, it, expect } from 'vitest';
import { generateWhatsAppOrderMessage, getWhatsAppUrl, OFFICIAL_STORE_NAME, OFFICIAL_STORE_OWNER } from '../src/lib/whatsapp';
import { signToken, verifyToken } from '../src/lib/auth';
import { checkoutSchema } from '../src/lib/validations';

describe('WhatsApp Order Message Generator', () => {
  it('formats confirmed and price-on-request products accurately', () => {
    const mockOrder = {
      orderNumber: 'SUNNY-2026-9812',
      customerName: 'Muhammad Ali',
      customerPhone: '03001234567',
      customerWhatsapp: '03001234567',
      deliveryAddress: 'House 14, Street 2',
      city: 'Lahore',
      area: 'DHA Phase 5',
      deliveryInstructions: 'Deliver by 8 AM',
      items: [
        {
          productNameSnapshot: 'Fresh Cow Milk',
          selectedVariant: '2L',
          quantity: 1,
          unitPriceSnapshot: null,
          priceConfirmationRequired: true,
        },
        {
          productNameSnapshot: 'Pure Makhan',
          selectedVariant: '1kg',
          quantity: 1,
          unitPriceSnapshot: 1500,
          priceConfirmationRequired: false,
        },
        {
          productNameSnapshot: 'Desi Pure Ghee',
          selectedVariant: '1kg',
          quantity: 1,
          unitPriceSnapshot: 2600,
          priceConfirmationRequired: false,
        },
        {
          productNameSnapshot: 'Barfi',
          selectedVariant: '500g',
          quantity: 1,
          unitPriceSnapshot: null,
          priceConfirmationRequired: true,
        },
      ],
      subtotal: 4100, // 1500 + 2600
      priceConfirmationRequired: true,
    };

    const message = generateWhatsAppOrderMessage(mockOrder);

    // Verify key fields
    expect(message).toContain('SUNNY-2026-9812');
    expect(message).toContain('Muhammad Ali');
    expect(message).toContain('DHA Phase 5');
    expect(message).toContain('Fresh Cow Milk — 2L — Qty 1 — Price to be confirmed');
    expect(message).toContain('Pure Makhan — 1kg — Qty 1 — Rs. 1,500');
    expect(message).toContain('Desi Pure Ghee — 1kg — Qty 1 — Rs. 2,600');
    expect(message).toContain('Barfi — 500g — Qty 1 — Price to be confirmed');
    expect(message).toContain('Confirmed Subtotal: *Rs. 4,100*');
    expect(message).toContain('morning batch price confirmation');
  });

  it('generates a valid WhatsApp URL with encoded message', () => {
    const url = getWhatsAppUrl('Hello SUNNY Dairy!');
    expect(url).toContain('https://wa.me/96895234002?text=Hello%20SUNNY%20Dairy!');
  });
});

describe('Checkout Validation Schema', () => {
  it('validates a correct checkout payload with Pakistani phone and Lahore address', () => {
    const validData = {
      customerName: 'Ahmad Khan',
      customerPhone: '03449322930',
      customerWhatsapp: '03449322930',
      deliveryAddress: 'Street 4, Cantt Area',
      city: 'Dera Ismail Khan',
      area: 'Cantt Area',
      deliveryInstructions: 'Leave with guard if ring unanswered',
      paymentMethod: 'CASH_ON_DELIVERY',
      items: [
        {
          productId: 'prod_123',
          selectedVariant: '1kg',
          quantity: 2,
        },
      ],
    };

    const parseResult = checkoutSchema.safeParse(validData);
    expect(parseResult.success).toBe(true);

    const invalidData = {
      ...validData,
      customerName: 'A', // too short
      customerPhone: '123', // invalid phone
      items: [], // empty cart
    };

    const invalidResult = checkoutSchema.safeParse(invalidData);
    expect(invalidResult.success).toBe(false);
  });

  it('validates ADVANCE_UBL and DIRECT_WHATSAPP payment methods properly', () => {
    const advanceUblData = {
      customerName: 'Muhammad Tariq',
      customerPhone: '03449322930',
      customerWhatsapp: '03449322930',
      deliveryAddress: 'House 12, Circular Road',
      city: 'Dera Ismail Khan',
      area: 'Circular Road',
      paymentMethod: 'ADVANCE_UBL',
      senderName: 'Muhammad Tariq',
      transactionReference: 'UBL-9041283',
      receiptImageUrl: '/uploads/receipts/receipt-test.png',
      items: [
        {
          productId: 'cow-milk-01',
          selectedVariant: '2L',
          quantity: 2,
        },
      ],
    };
    const resAdvance = checkoutSchema.safeParse(advanceUblData);
    expect(resAdvance.success).toBe(true);

    const whatsappData = {
      ...advanceUblData,
      paymentMethod: 'DIRECT_WHATSAPP',
    };
    const resWhatsapp = checkoutSchema.safeParse(whatsappData);
    expect(resWhatsapp.success).toBe(true);
  });
});

describe('Admin Authentication & Session Security', () => {
  it('signs and verifies valid admin tokens and rejects tampered ones', () => {
    const token = signToken('admin-user-01', 'admin', 'SUPER_ADMIN');
    const result = verifyToken(token);
    expect(result.valid).toBe(true);
    expect(result.username).toBe('admin');
    expect(result.role).toBe('SUPER_ADMIN');
    expect(result.adminId).toBe('admin-user-01');

    // Tampered token test
    const tampered = token.slice(0, -4) + 'abcd';
    const tamperedResult = verifyToken(tampered);
    expect(tamperedResult.valid).toBe(false);
  });
});
