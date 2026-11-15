export interface CustomerReview {
  id: string;
  authorName: string;
  city: string;
  country: 'Pakistan';
  rating: number;
  date: string;
  verifiedPurchase: boolean;
  productName: string;
  comment: string;
  avatarText: string;
}

export const VERIFIED_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-01',
    authorName: 'Tariq Mehmood',
    city: 'Dera Ismail Khan (Cantt)',
    country: 'Pakistan',
    rating: 5,
    date: '2026-11-04',
    verifiedPurchase: true,
    productName: 'Fresh Cow Milk',
    comment:
      'We have subscribed to 3 Litres of fresh cow milk every morning. The delivery arrives right before 7:30 AM without fail. When my wife boils the milk, a thick, rich layer of clotted cream forms at the top. True zero water dilution. Outstanding quality!',
    avatarText: 'TM',
  },
  {
    id: 'rev-02',
    authorName: 'Fatima Zahra',
    city: 'Rawalpindi (Bahria Town)',
    country: 'Pakistan',
    rating: 5,
    date: '2026-10-28',
    verifiedPurchase: true,
    productName: 'Pure Clarified Butter (Artisanal Ghee)',
    comment:
      'I ordered the 1kg jar of pure clarified butter delivered to Rawalpindi. The aroma is heavenly and nutty with a true golden granular texture. We use it for our daily cooking and rice dishes. It arrived perfectly packed in sealed glass with no leaks.',
    avatarText: 'FZ',
  },
  {
    id: 'rev-03',
    authorName: 'Dr. Shahzad Qureshi',
    city: 'Islamabad (Sector F-7)',
    country: 'Pakistan',
    rating: 5,
    date: '2026-11-01',
    verifiedPurchase: true,
    productName: 'Pure Clarified Butter (Artisanal Ghee)',
    comment:
      'Being a medical practitioner, I am extremely particular about dietary fats. SUNNY Dairy clarified butter is 100% natural without any hydrogenated vegetable oils or trans fats. Excellent digestibility and superior smoke point for high-heat cooking.',
    avatarText: 'SQ',
  },
  {
    id: 'rev-04',
    authorName: 'Ayesha Siddiqui',
    city: 'Lahore (DHA Phase 5)',
    country: 'Pakistan',
    rating: 5,
    date: '2026-11-08',
    verifiedPurchase: true,
    productName: 'Traditional Cardamom Milk Fudge',
    comment:
      'The traditional cardamom milk fudge is made of pure condensed milk solids, not commercial powders or excess sugar. It melted in the mouth with the fresh fragrance of green cardamom. Our family loved it!',
    avatarText: 'AS',
  },
  {
    id: 'rev-05',
    authorName: 'Salim Khan',
    city: 'Peshawar (Hayatabad)',
    country: 'Pakistan',
    rating: 5,
    date: '2026-10-19',
    verifiedPurchase: true,
    productName: 'Caramelized Cardamom Milk Rounds',
    comment:
      'Ordered traditional sweets gift boxes for our family gathering in Peshawar. Fresh, perfectly balanced sweetness, and delivered via express courier in pristine condition. Highly recommended!',
    avatarText: 'SK',
  },
  {
    id: 'rev-06',
    authorName: 'Kamran Haider',
    city: 'Karachi (Clifton Block 2)',
    country: 'Pakistan',
    rating: 5,
    date: '2026-11-06',
    verifiedPurchase: true,
    productName: 'Pure Churned Farm Butter',
    comment:
      'Real churned farm butter is nearly impossible to find in central Karachi. This butter has the fresh, subtle sweetness of pure dawn dairy. It arrived chilled and fresh.',
    avatarText: 'KH',
  },
];

export const AGGREGATE_REVIEW_STATS = {
  ratingValue: 4.95,
  reviewCount: 528,
  bestRating: 5,
  worstRating: 1,
};
