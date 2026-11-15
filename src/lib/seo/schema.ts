import { BlogPost } from '@/data/blogPosts';
import { CityLocation } from '@/data/locations';
import { VERIFIED_REVIEWS, AGGREGATE_REVIEW_STATS } from '@/data/reviews';

const SITE_URL = 'https://sunny-dairy-web.vercel.app';

export function getLocalBusinessSchema(city?: CityLocation) {
  const cityName = city ? city.cityName : 'Dera Ismail Khan';
  const countryName = city ? city.country : 'Pakistan';
  const countryCode = city ? city.countryCode : 'PK';

  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'DairyFarm', 'Store'],
    '@id': `${SITE_URL}/#organization-${city ? city.slug : 'main'}`,
    name: city ? `SUNNY Dairy — ${cityName}, ${countryName}` : 'SUNNY Dairy',
    alternateName: ['SUNNY Dairy Pure & Farm Fresh', 'Sunny Dairy Farm'],
    url: city ? `${SITE_URL}/locations/${city.slug}` : SITE_URL,
    logo: `${SITE_URL}/nev-logo.png`,
    image: `${SITE_URL}/nev-logo.png`,
    telephone: countryCode === 'OM' ? '+96895234002' : '+923449322930',
    email: 'sanaullah.ccs@gmail.com',
    priceRange: countryCode === 'OM' ? 'OMR 2 - OMR 35' : '₨100 - ₨5000',
    currenciesAccepted: countryCode === 'OM' ? 'OMR' : 'PKR',
    paymentAccepted: 'Cash on Delivery, Bank Transfer, Raast, Direct WhatsApp Order',
    founder: {
      '@type': 'Person',
      name: 'Sanaullah',
      jobTitle: 'Store Owner & Master Dairy Farm Manager',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'SUNNY Dairy Farm, Main Farm Route',
      addressLocality: cityName,
      addressRegion: city ? city.cityName : 'Khyber Pakhtunkhwa',
      addressCountry: countryCode,
    },
    areaServed: [
      {
        '@type': 'City',
        name: cityName,
      },
      {
        '@type': 'Country',
        name: countryName,
      },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '05:00',
        closes: '22:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: AGGREGATE_REVIEW_STATS.ratingValue.toString(),
      reviewCount: AGGREGATE_REVIEW_STATS.reviewCount.toString(),
      bestRating: AGGREGATE_REVIEW_STATS.bestRating.toString(),
      worstRating: AGGREGATE_REVIEW_STATS.worstRating.toString(),
    },
  };
}

export function getProductSchema(product: {
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  sku?: string;
  variants?: { price: number | null; isAvailable: boolean }[];
}) {
  const confirmedVariant = product.variants?.find((v) => v.price !== null && v.price > 0);
  const price = confirmedVariant?.price || 1500;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.imageUrl.startsWith('http') ? product.imageUrl : `${SITE_URL}${product.imageUrl}`,
    description: product.description,
    sku: product.sku || `SNY-${product.slug.toUpperCase()}`,
    mpn: `SNY-${product.slug.toUpperCase()}`,
    brand: {
      '@type': 'Brand',
      name: 'SUNNY Dairy',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: 'PKR',
      price: price.toString(),
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
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
}

export function getFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

export function getArticleSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    headline: post.title,
    description: post.metaDescription,
    image: post.coverImage.startsWith('http') ? post.coverImage : `${SITE_URL}${post.coverImage}`,
    datePublished: post.publishedDate,
    dateModified: post.publishedDate,
    author: {
      '@type': 'Person',
      name: post.author.name,
      jobTitle: post.author.role,
      url: `${SITE_URL}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SUNNY Dairy',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/nev-logo.png`,
      },
    },
    keywords: post.keywords.join(', '),
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}
