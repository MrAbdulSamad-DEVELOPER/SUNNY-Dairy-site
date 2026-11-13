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

export async function generateMetadata({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  });

  if (!product) {
    return {
      title: `Product Not Found — ${OFFICIAL_STORE_NAME}`,
    };
  }

  return {
    title: `${product.name} — ${OFFICIAL_STORE_NAME}`,
    description: product.description,
    openGraph: {
      title: `${product.name} — ${OFFICIAL_STORE_NAME}`,
      description: product.description,
      images: [{ url: product.imageUrl }],
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

  return (
    <ProductDetailView
      product={JSON.parse(JSON.stringify(product))}
      relatedProducts={JSON.parse(JSON.stringify(related))}
    />
  );
}
