export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentAdmin, logActivity } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const includeInactive = searchParams.get('includeInactive') === 'true';

    const where: any = {};
    if (!includeInactive) {
      where.isActive = true;
    }

    if (category && category !== 'all') {
      where.category = {
        slug: category,
      };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (search && search.trim()) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
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

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to retrieve products' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    if (!name || !description || !categoryId) {
      return NextResponse.json({ error: 'Missing required product fields' }, { status: 400 });
    }

    const cleanSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug: cleanSlug,
        description,
        shortDescription: shortDescription || null,
        categoryId,
        imageUrl: imageUrl || '/products/cow-milk.jpg',
        sku: sku || null,
        stockQuantity: parseInt(stockQuantity, 10) || 100,
        lowStockThreshold: parseInt(lowStockThreshold, 10) || 10,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: Boolean(isFeatured),
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        variants: {
          create: (variants || []).map((v: any) => ({
            size: v.size,
            price: v.priceType === 'CONFIRMED' && v.price !== null && v.price !== '' ? parseFloat(v.price) : null,
            priceType: v.priceType || 'ON_REQUEST',
            isAvailable: v.isAvailable !== undefined ? v.isAvailable : true,
            stock: parseInt(v.stock, 10) || 50,
          })),
        },
      },
      include: {
        category: true,
        variants: true,
      },
    });

    await logActivity({
      action: 'CREATE_PRODUCT',
      entityType: 'PRODUCT',
      entityId: newProduct.id,
      details: `Created product ${newProduct.name}`,
      adminId: admin.id,
      adminUsername: admin.username,
      ipAddress: req.headers.get('x-forwarded-for') || undefined,
    });

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
