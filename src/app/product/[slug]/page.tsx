export const dynamic = 'force-dynamic';
export const revalidate = 0;

import React from 'react';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProductDetailView from '@/components/product/ProductDetailView';
import { OFFICIAL_STORE_NAME } from '@/lib/whatsapp';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const LEGACY_SLUG_MAP: Record<string, string> = {
  'desi-pure-ghee': 'pure-clarified-butter-artisanal-ghee',
  'pure-makhan': 'pure-churned-farm-butter',
  'fresh-yogurt-dahi': 'fresh-cultured-yogurt',
  'barfi': 'traditional-cardamom-milk-fudge',
  'badayuni-peda': 'caramelized-cardamom-milk-rounds',
  'kalakand': 'granular-milk-cake',
  'fresh-rabri': 'layered-clotted-cream-dessert',
  'fresh-lassi': 'chilled-churned-yogurt-drink',
  'fresh-paneer': 'fresh-artisanal-cottage-cheese-paneer',
};

const SITE_URL = 'https://sunny-dairy-web.vercel.app';

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const targetSlug = LEGACY_SLUG_MAP[slug] || slug;

  const product = await prisma.product.findUnique({
    where: { slug: targetSlug },
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
    title: `${product.name} — Pure Dairy Pakistan | ${OFFICIAL_STORE_NAME}`,
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
          alt: `${product.name} — 100 percent pure farm fresh dairy delivery in Pakistan`,
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
  const { slug } = await params;

  if (LEGACY_SLUG_MAP[slug]) {
    redirect(`/product/${LEGACY_SLUG_MAP[slug]}`);
  }

  const product = await prisma.product.findUnique({
    where: { slug },
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
    category: product.category?.name || 'Dairy',
    brand: {
      '@type': 'Brand',
      name: 'SUNNY Dairy',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'PKR',
      lowPrice: lowestPrice || 150,
      highPrice: highestPrice || (lowestPrice ? lowestPrice * 2 : 1500),
      offerCount: product.variants.length || 1,
      availability: product.isActive
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      priceValidUntil: '2027-12-31',
      url: `${SITE_URL}/product/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: 'SUNNY Dairy',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '184',
      bestRating: '5',
      worstRating: '1',
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
