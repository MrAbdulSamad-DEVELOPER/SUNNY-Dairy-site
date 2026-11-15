import React from 'react';
import prisma from '@/lib/prisma';
import { ProductDTO } from '@/types';
import ShopCatalog from '@/components/product/ShopCatalog';
import { OFFICIAL_STORE_NAME } from '@/lib/whatsapp';

const SITE_URL = 'https://sunny-dairy-web.vercel.app';

export const metadata = {
  title: 'Online Milk Catalog — Buy Pure Farm Milk & Desi Ghee Online | SUNNY Dairy Pakistan',
  description:
    'Pakistan’s leading online milk website catalog. Order 100% pure cow milk, buffalo milk, churned farm butter, pure clarified butter (desi ghee), and traditional sweets online with cold-chain delivery.',
  keywords: [
    'pakistan milk online website',
    'online milk website',
    'buy milk online pakistan',
    'pure cow milk online',
    'buy pure desi ghee online',
    'fresh milk delivery catalog',
  ],
  alternates: {
    canonical: `${SITE_URL}/shop`,
  },
  openGraph: {
    title: 'Online Milk Catalog — SUNNY Dairy Pakistan Milk Online Website',
    description:
      'Order pure farm milk, churned butter, pure clarified butter (desi ghee), and traditional milk sweets online across Pakistan.',
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
