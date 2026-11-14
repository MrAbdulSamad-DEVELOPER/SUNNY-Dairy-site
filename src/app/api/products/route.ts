export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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

    return NextResponse.json(
      { success: true, products },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
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

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    // Defensive fallback for categoryId
    let targetCategoryId = categoryId;
    if (!targetCategoryId) {
      const firstCat = await prisma.category.findFirst({ orderBy: { createdAt: 'asc' } });
      if (firstCat) {
        targetCategoryId = firstCat.id;
      } else {
        const defaultCat = await prisma.category.create({
          data: {
            name: 'Pure Dairy',
            slug: 'pure-dairy',
            description: 'Farm fresh pure dairy products',
          },
        });
        targetCategoryId = defaultCat.id;
      }
    }

    const cleanDescription = (description && description.trim())
      ? description.trim()
      : (shortDescription && shortDescription.trim())
        ? shortDescription.trim()
        : `${name.trim()} - 100% pure and farm-fresh dairy from SUNNY Dairy.`;

    const cleanSlug = slug
      ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const cleanVariants = (variants && Array.isArray(variants) && variants.length > 0)
      ? variants
      : [{ size: '1 Unit', priceType: 'ON_REQUEST', price: null, isAvailable: true, stock: 50 }];

    const newProduct = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
        description: cleanDescription,
        shortDescription: shortDescription || null,
        categoryId: targetCategoryId,
        imageUrl: imageUrl || '/products/cow-milk.jpg',
        sku: sku || null,
        stockQuantity: parseInt(stockQuantity, 10) || 100,
        lowStockThreshold: parseInt(lowStockThreshold, 10) || 10,
        isActive: isActive !== undefined ? isActive : true,
        isFeatured: Boolean(isFeatured),
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        variants: {
          create: cleanVariants.map((v: any) => ({
            size: v.size || '1 Unit',
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

    try {
      revalidatePath('/');
      revalidatePath('/shop');
      revalidatePath('/product/[slug]', 'page');
    } catch (e) {
      console.warn('Revalidation notice:', e);
    }

    return NextResponse.json(
      { success: true, product: newProduct },
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    );
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}
