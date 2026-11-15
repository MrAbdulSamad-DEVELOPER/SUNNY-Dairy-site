import React from 'react';
import prisma from '@/lib/prisma';
import { ProductDTO } from '@/types';
import ShopCatalog from '@/components/product/ShopCatalog';
import { OFFICIAL_STORE_NAME } from '@/lib/whatsapp';

const SITE_URL = 'https://sunny-dairy-web.vercel.app';

export const metadata = {
  title: 'Shop All Farm Dairy & Clarified Butter — SUNNY Dairy | Pakistan',
  description:
    'Order 100% pure farm milk, churned farm butter, pure clarified butter (desi ghee), artisanal cottage cheese, and traditional milk sweets online across Pakistan.',
  alternates: {
    canonical: `${SITE_URL}/shop`,
  },
  openGraph: {
    title: 'Fresh Dairy & Artisanal Clarified Butter Catalog — SUNNY Dairy',
    description:
      'Order fresh farm milk, churned butter, pure clarified butter (artisanal ghee), and traditional milk sweets delivered to your door across Pakistan.',
    url: `${SITE_URL}/shop`,
    type: 'website',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getProducts(): Promise<ProductDTO[]> {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      include: {
        category: true,
        variants: {
          orderBy: { size: 'asc' },
        },
      },
    });

    return JSON.parse(JSON.stringify(products));
  } catch (e) {
    console.error('Failed to load products for shop page', e);
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="pt-6 sm:pt-10">
      <ShopCatalog initialProducts={products} showTitle={true} />
    </div>
  );
}
