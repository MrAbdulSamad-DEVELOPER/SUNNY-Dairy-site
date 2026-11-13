export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React from 'react';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductDetailView from '@/components/product/ProductDetailView';
import { OFFICIAL_STORE_NAME } from '@/lib/whatsapp';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

const SITE_URL = 'https://sunny-dairy-web.vercel.app';

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return {
      title: `Product Not Found — ${OFFICIAL_STORE_NAME}`,
    };
  }

  const productUrl = `${SITE_URL}/product/${product.slug}`;
  const fullImageUrl = product.imageUrl.startsWith('http')
    ? product.imageUrl
    : `${SITE_URL}${product.imageUrl}`;

  return {
    title: `${product.name} — Pure Dairy Dera Ismail Khan`,
    description: product.shortDescription || product.description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} | ${OFFICIAL_STORE_NAME}`,
      description: product.shortDescription || product.description,
      url: productUrl,
      images: [
        {
          url: fullImageUrl,
          alt: `${product.name} — ${OFFICIAL_STORE_NAME}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | ${OFFICIAL_STORE_NAME}`,
      description: product.shortDescription || product.description,
      images: [fullImageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      variants: {
        orderBy: { size: 'asc' },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    take: 3,
    include: {
      category: true,
      variants: true,
    },
  });

  const prices = product.variants
    .map((v) => v.price)
    .filter((p): p is number => typeof p === 'number' && !isNaN(p));

  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.imageUrl.startsWith('http')
      ? product.imageUrl
      : `${SITE_URL}${product.imageUrl}`,
    sku: product.sku || product.slug,
    brand: {
      '@type': 'Brand',
      name: 'SUNNY Dairy',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'PKR',
      lowPrice: lowestPrice,
      highPrice: highestPrice,
      offerCount: product.variants.length || 1,
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/product/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: 'SUNNY Dairy',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <ProductDetailView
        product={JSON.parse(JSON.stringify(product))}
        relatedProducts={JSON.parse(JSON.stringify(related))}
      />
    </>
  );
}
