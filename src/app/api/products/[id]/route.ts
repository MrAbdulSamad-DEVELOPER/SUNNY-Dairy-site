export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin, logActivity } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id: params.id }, { slug: params.id }],
      },
      include: {
        category: true,
        variants: {
          orderBy: { size: 'asc' },
        },
        images: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve product' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      slug,
      description,
      shortDescription,
      categoryId,
      imageUrl,
      sku,
      stockQuantity,
      lowStockThreshold,
      isActive,
      isFeatured,
      variants,
      seoTitle,
      seoDescription,
    } = body;

    await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        shortDescription,
        categoryId,
        imageUrl,
        sku,
        stockQuantity: parseInt(stockQuantity, 10),
        lowStockThreshold: parseInt(lowStockThreshold, 10),
        isActive,
        isFeatured,
        seoTitle,
        seoDescription,
      },
    });

    if (variants && Array.isArray(variants)) {
      await prisma.productVariant.deleteMany({
        where: { productId: params.id },
      });

      for (const v of variants) {
        await prisma.productVariant.create({
          data: {
            productId: params.id,
            size: v.size,
            price: v.priceType === 'CONFIRMED' && v.price !== null && v.price !== '' ? parseFloat(v.price) : null,
            priceType: v.priceType || 'ON_REQUEST',
            isAvailable: v.isAvailable !== undefined ? v.isAvailable : true,
            stock: parseInt(v.stock, 10) || 50,
          },
        });
      }
    }

    const updated = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        variants: true,
      },
    });

    await logActivity({
      action: 'UPDATE_PRODUCT',
      entityType: 'PRODUCT',
      entityId: params.id,
      details: `Updated product ${updated?.name}`,
      adminId: admin.id,
      adminUsername: admin.username,
      ipAddress: req.headers.get('x-forwarded-for') || undefined,
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const existing = await prisma.product.findUnique({ where: { id: params.id } });
    await prisma.product.delete({
      where: { id: params.id },
    });

    await logActivity({
      action: 'DELETE_PRODUCT',
      entityType: 'PRODUCT',
      entityId: params.id,
      details: `Deleted product ${existing?.name || params.id}`,
      adminId: admin.id,
      adminUsername: admin.username,
      ipAddress: req.headers.get('x-forwarded-for') || undefined,
    });

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
