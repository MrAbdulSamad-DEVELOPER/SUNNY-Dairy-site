export interface CityLocation {
  slug: string;
  cityName: string;
  country: 'Pakistan' | 'Oman';
  countryCode: 'PK' | 'OM';
  metaTitle: string;
  metaDescription: string;
  h1Title: string;
  heroSubtitle: string;
  deliverySchedule: string;
  minimumOrder: string;
  paymentOptions: string[];
  serviceAreas: string[];
  leadContent: string;
  qualityFeatures: {
    title: string;
    description: string;
  }[];
  localFaqs: {
    question: string;
    answer: string;
  }[];
}

export const CITIES_DATA: CityLocation[] = [
  // --- PAKISTAN CITIES ---
  {
    slug: 'dera-ismail-khan',
    cityName: 'Dera Ismail Khan',
    country: 'Pakistan',
    countryCode: 'PK',
    metaTitle: 'Fresh Milk & Pure Desi Ghee Delivery in Dera Ismail Khan | SUNNY Dairy',
    metaDescription: '100% pure farm-fresh cow milk, goat milk, churned butter, and slow-cooked clarified butter delivered daily across Dera Ismail Khan Cantt, City & Circular Road.',
    h1Title: 'Fresh Farm Milk & Pure Clarified Butter Home Delivery in Dera Ismail Khan',
    heroSubtitle: 'Direct from our local farm gate to your family table every morning before 8:30 AM.',
    deliverySchedule: 'Daily Morning Delivery: 7:00 AM – 8:30 AM (Evening slot upon request)',
    minimumOrder: '1 Litre Milk / 250g Clarified Butter',
    paymentOptions: ['Cash on Delivery (COD)', 'UBL Bank Transfer', 'Raast Instant Pay'],
    serviceAreas: [
      'Cantt Area & Officers Colony',
      'Circular Road & Multan Road',
      'Topanwala Gate & City Center',
      'Gomal University Campus & Town',
      'Bannu Road Residential Areas',
      'Zafar Park & Shorkot Environs',
    ],
    leadContent: 'As the proud home base of SUNNY Dairy, Dera Ismail Khan enjoys our freshest direct farm milk, delivered within hours of dawn milking. Under the direct supervision of founder Sanaullah, our local fleet ensures pure unadulterated milk and artisanal dairy reach your home in sealed food-grade containers with zero water dilution.',
    qualityFeatures: [
      {
        title: 'Dawn Milking Cycle',
        description: 'Milked at 5:00 AM daily and immediately chilled below 4°C in stainless steel bulk tanks.',
      },
      {
        title: 'Zero Water Dilution Guaranteed',
        description: 'Every batch verified with optical lactometers to ensure full natural cream content and zero adulteration.',
      },
      {
        title: 'Free Local Home Delivery',
        description: 'Reliable doorstep morning delivery across DI Khan neighborhoods with zero delivery surcharge on subscriptions.',
      },
    ],
    localFaqs: [
      {
        question: 'What time does the morning delivery arrive in Dera Ismail Khan?',
        answer: 'Our morning delivery routes run between 7:00 AM and 8:30 AM daily, ensuring fresh milk is at your doorstep in time for family breakfast.',
      },
      {
        question: 'Can I set up a recurring daily subscription in DI Khan?',
        answer: 'Yes! We offer 1 Litre, 2 Litres, 5 Litres, and custom daily recurring deliveries that you can pause or modify anytime via WhatsApp or our website.',
      },
    ],
  },
  {
    slug: 'islamabad',
    cityName: 'Islamabad',
    country: 'Pakistan',
    countryCode: 'PK',
    metaTitle: 'Pure Desi Ghee & Fresh Dairy Delivery in Islamabad | SUNNY Dairy',
    metaDescription: 'Order pure clarified butter (desi ghee), artisanal farm butter, and traditional sweets delivered to your doorstep across Islamabad sectors (F, G, E, DHA & Bahria).',
    h1Title: 'Pure Clarified Butter & Artisanal Farm Dairy Home Delivery in Islamabad',
    heroSubtitle: 'Laboratory-tested organic dairy and traditional sweets delivered express across the Federal Capital.',
    deliverySchedule: 'Express Courier & Temperature-Safe Shipping: 24 to 48 Hours',
    minimumOrder: '500g Clarified Butter / 1 Box Sweets',
    paymentOptions: ['Advance UBL Bank Transfer', 'Raast Fast Pay', 'Cash on Delivery (Courier)'],
    serviceAreas: [
      'Sectors F-6, F-7, F-8, F-10, F-11',
      'Sectors G-9, G-10, G-11, G-13',
      'Sectors E-7, E-11 & Margalla Town',
      'DHA Phase 1, Phase 2, Phase 5',
      'Bahria Town Phase 1–8',
      'Chak Shahzad Farmhouses & Bani Gala',
    ],
    leadContent: 'Residents of Islamabad value natural wellness and organic purity. SUNNY Dairy delivers premium slow-simmered clarified butter (desi ghee), churned farm butter, and authentic milk sweets directly to households across Islamabad, preserving traditional pastoral flavor without artificial preservatives.',
    qualityFeatures: [
      {
        title: 'Airtight Glass Packaging',
        description: 'Our clarified butter is packed in sealed glass jars, protecting beneficial butyric acid and fat-soluble vitamins.',
      },
      {
        title: 'Pure Traditional Confectionery',
        description: 'Luxury gift boxes of traditional milk fudge and caramelized milk rounds crafted from 100% condensed milk solids.',
      },
      {
        title: 'Express Doorstep Courier',
        description: 'Fast, secure doorstep delivery across all sectors of Islamabad with real-time consignment tracking.',
      },
    ],
    localFaqs: [
      {
        question: 'How is clarified butter shipped safely to Islamabad?',
        answer: 'Clarified butter is packaged in heavy shatter-proof cushioned boxes with hermetic jar seals, ensuring it arrives fresh and aromatic without leaks.',
      },
      {
        question: 'Do you offer bulk delivery for Islamabad restaurants and embassies?',
        answer: 'Yes, we supply bulk 5kg and 10kg tins of pure clarified butter for catering, diplomatic missions, and fine dining establishments across Islamabad.',
      },
    ],
  },
  {
    slug: 'rawalpindi',
    cityName: 'Rawalpindi',
    country: 'Pakistan',
    countryCode: 'PK',
    metaTitle: 'Pure Desi Ghee & Artisanal Sweets Delivery in Rawalpindi | SUNNY Dairy',
    metaDescription: 'Get 100% authentic clarified butter (desi ghee), cultured farm butter, and pure traditional sweets delivered to your door in Rawalpindi, Bahria & Cantt.',
    h1Title: 'Pure Clarified Butter & Traditional Dairy Home Delivery in Rawalpindi',
    heroSubtitle: 'Authentic pastoral dairy crafted with zero adulteration, shipped direct from farm gate to Rawalpindi.',
    deliverySchedule: 'Doorstep Courier Delivery: 24 to 48 Hours',
    minimumOrder: '500g Clarified Butter / 1 Box Sweets',
    paymentOptions: ['Cash on Delivery', 'UBL Bank Transfer', 'Raast Instant Payment'],
    serviceAreas: [
      'Rawalpindi Cantt & Saddar',
      'Bahria Town Phases 1–8',
      'DHA Rawalpindi',
      'Satellite Town & Shamsabad',
      'Westridge & Peshawar Road',
      'Askari Housing Schemes (All Phases)',
    ],
    leadContent: 'Enjoy the rich, nutty fragrance of genuine clarified butter in Rawalpindi. SUNNY Dairy brings pastoral purity back to your family kitchen with our artisanal slow-cooked ghee and traditional confectionery prepared exclusively from whole farm dairy.',
    qualityFeatures: [
      {
        title: 'Danedaar Granular Texture',
        description: 'Natural slow-cooling creates golden granules that melt smoothly over warm parathas and aromatic dishes.',
      },
      {
        title: 'Zero Chemical Additives',
        description: 'Completely free of palm stearin, synthetic scents, or artificial coloring agents.',
      },
      {
        title: 'Secure Online Ordering',
        description: 'Quick checkout with instant order confirmation and live WhatsApp assistance.',
      },
    ],
    localFaqs: [
      {
        question: 'Can I pay on delivery in Rawalpindi?',
        answer: 'Yes, cash on delivery is fully supported for courier deliveries across Rawalpindi and surrounding residential societies.',
      },
    ],
  },
  {
    slug: 'lahore',
    cityName: 'Lahore',
    country: 'Pakistan',
    countryCode: 'PK',
    metaTitle: 'Pure Desi Ghee & Farm Butter Delivery in Lahore | SUNNY Dairy',
    metaDescription: 'Experience authentic slow-cooked clarified butter (desi ghee), churned butter, and traditional sweets delivered to Gulberg, DHA, Bahria & Model Town Lahore.',
    h1Title: 'Pure Clarified Butter & Artisanal Farm Dairy Home Delivery in Lahore',
    heroSubtitle: 'Lahore’s trusted source for 100% natural clarified butter and authentic whole-milk confectionery.',
    deliverySchedule: 'Express Parcel Delivery: 24 to 48 Hours',
    minimumOrder: '500g Clarified Butter / 1 Box Confectionery',
    paymentOptions: ['Cash on Delivery', 'UBL Bank Transfer', 'Raast Payment'],
    serviceAreas: [
      'DHA Lahore (Phases 1 through 9)',
      'Gulberg, Canal Road & Cantt',
      'Model Town & Garden Town',
      'Bahria Town & Lake City',
      'Johar Town & Wapda Town',
      'Walled City & Mall Road Environs',
    ],
    leadContent: 'Lahori cuisine is world-renowned for its hearty flavors and rich culinary heritage. Elevate your traditional cooking with SUNNY Dairy’s pure clarified butter and cardamom milk confectionery, slow-simmered over gentle heat from dawn whole milk.',
    qualityFeatures: [
      {
        title: 'Authentic Traditional Flavor',
        description: 'Infuses biryanis, qormas, and halwas with genuine dairy aroma unachievable with commercial oils.',
      },
      {
        title: 'High Smoke Point (250°C)',
        description: 'Safe for deep frying and high-heat Lahori stir-frying without creating harmful free radicals.',
      },
      {
        title: 'Direct Farm Traceability',
        description: 'Produced by our registered herd with verifiable source transparency.',
      },
    ],
    localFaqs: [
      {
        question: 'How quickly does delivery reach Lahore?',
        answer: 'Orders confirmed before 2:00 PM are dispatched same-day via express overnight courier and reach Lahore within 24 to 48 hours.',
      },
    ],
  },
  {
    slug: 'karachi',
    cityName: 'Karachi',
    country: 'Pakistan',
    countryCode: 'PK',
    metaTitle: 'Pure Desi Ghee & Traditional Sweets Delivery in Karachi | SUNNY Dairy',
    metaDescription: 'Shop 100% pure clarified butter (desi ghee) and traditional milk sweets online in Karachi. Fast insured delivery across Clifton, DHA, PECHS, Gulshan & KDA.',
    h1Title: 'Pure Clarified Butter & Traditional Dairy Home Delivery in Karachi',
    heroSubtitle: 'Direct farm-fresh clarified butter and authentic milk fudge delivered to the City of Lights.',
    deliverySchedule: 'Air Cargo & Express Courier: 48 Hours',
    minimumOrder: '1kg Clarified Butter / 1kg Confectionery',
    paymentOptions: ['Advance UBL Bank Transfer', 'Raast Fast Pay', 'Cash on Delivery'],
    serviceAreas: [
      'Clifton (Blocks 1–9) & Sea View',
      'DHA Karachi (Phases 1–8)',
      'PECHS, Bahadurabad & SMCHS',
      'Gulshan-e-Iqbal & Gulistan-e-Jauhar',
      'North Nazimabad & Federal B Area',
      'Malir Cantt & Scheme 33',
    ],
    leadContent: 'In a bustling metropolis like Karachi, finding genuine, unadulterated dairy products can be challenging. SUNNY Dairy bridges the gap by shipping laboratory-pure clarified butter and authentic traditional sweets directly from our farm in Khyber Pakhtunkhwa to your doorstep in Karachi.',
    qualityFeatures: [
      {
        title: 'Zero Chemical Bleaching',
        description: 'Never processed with chemical deodorizers, preserving golden color and natural fat-soluble vitamins.',
      },
      {
        title: 'Guaranteed Authentic Scent',
        description: 'Rich natural caramelized aroma that authenticates pure butter reduction.',
      },
      {
        title: 'Insured Delivery to Your Door',
        description: 'Every shipment is securely packaged and tracked until safely handed to you in Karachi.',
      },
    ],
    localFaqs: [
      {
        question: 'Does hot weather affect clarified butter shipped to Karachi?',
        answer: 'Pure clarified butter naturally liquefies in warm climates like Karachi without compromising purity or nutritional value. Simply place the sealed jar in a cool cupboard or refrigerator to restore its granular texture.',
      },
    ],
  },
  {
    slug: 'peshawar',
    cityName: 'Peshawar',
    country: 'Pakistan',
    countryCode: 'PK',
    metaTitle: 'Pure Desi Ghee & Fresh Dairy Delivery in Peshawar | SUNNY Dairy',
    metaDescription: 'Order pure clarified butter (desi ghee), churned butter, and traditional sweets in Peshawar. Fast delivery to Hayatabad, University Town & Cantt.',
    h1Title: 'Pure Clarified Butter & Artisanal Dairy Home Delivery in Peshawar',
    heroSubtitle: 'KPK’s premier dairy farm delivering pure unadulterated pastoral goodness to Peshawar.',
    deliverySchedule: 'Same-Day / Next-Day Route: 24 Hours',
    minimumOrder: '500g Clarified Butter / 1 Box Sweets',
    paymentOptions: ['Cash on Delivery', 'UBL Bank Transfer', 'Raast Payment'],
    serviceAreas: [
      'Hayatabad (Phases 1–7)',
      'University Town & Campus',
      'Peshawar Cantt & Saddar',
      'Warsak Road & Regi Model Town',
      'Dalazak Road & City Environs',
    ],
    leadContent: 'Serving our neighboring provincial capital, SUNNY Dairy provides rapid next-day delivery of farm-fresh clarified butter, pure butter, and traditional milk confectionery across Hayatabad and Peshawar Cantt.',
    qualityFeatures: [
      {
        title: 'Rapid Regional Logistics',
        description: 'Short transit time from our Dera Ismail Khan farm ensures maximum freshness.',
      },
      {
        title: 'Traditional Shinwari & Chapli Pairing',
        description: 'The ultimate culinary fat for authentic Peshawari meat dishes, curries, and roasted meats.',
      },
      {
        title: 'Personal Customer Care',
        description: 'Dedicated Pashto and Urdu phone and WhatsApp customer support.',
      },
    ],
    localFaqs: [
      {
        question: 'How fast can I receive an order in Hayatabad, Peshawar?',
        answer: 'Most orders dispatched from our farm arrive in Peshawar within 24 hours via reliable regional transport.',
      },
    ],
  },
];

// Target international SEO keywords for overseas searchers (including Oman & GCC) seeking authentic Pakistani Desi Ghee
export const INTERNATIONAL_SEO_KEYWORDS = [
  'pure desi ghee Pakistan',
  'organic desi ghee Oman',
  'asli desi ghee price in Pakistan',
  'pure cow milk delivery Pakistan',
  'traditional sweets for overseas Pakistanis in Oman',
  'buy pure clarified butter online Muscat Oman',
  'farm fresh makhan and butter Pakistan',
];
