const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SUNNY Dairy database...');

  // 1. Clean existing test data and old branding
  await prisma.activityLog.deleteMany();
  await prisma.inventoryLog.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.deliveryZone.deleteMany();
  await prisma.cmsSection.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.adminUser.deleteMany();

  // 2. Initial Secure Administrator (Hashed password using bcryptjs)
  // Password is NOT plaintext.
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('SunnyDairyAdmin2026!', salt);

  await prisma.adminUser.create({
    data: {
      username: 'admin',
      email: 'admin@sunnydairy.pk',
      passwordHash: passwordHash,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  // 3. Categories
  const catMilkYogurt = await prisma.category.create({
    data: {
      id: 'cat-milk-yogurt',
      name: 'Milk & Yogurt',
      slug: 'milk-and-yogurt',
      description: 'Pure, fresh farm milk collected each morning and naturally cultured wholesome Pakistani dahi.',
    },
  });

  const catDairy = await prisma.category.create({
    data: {
      id: 'cat-dairy-products',
      name: 'Dairy Products',
      slug: 'dairy-products',
      description: 'Pure home-churned makhan, traditional slow-cooked desi ghee, and fresh artisanal paneer.',
    },
  });

  const catSweets = await prisma.category.create({
    data: {
      id: 'cat-traditional-sweets',
      name: 'Traditional Sweets',
      slug: 'traditional-sweets',
      description: 'Artisanal Pakistani mithai prepared with pure farm khoya, cardamom, and fresh whole milk.',
    },
  });

  const catDrinks = await prisma.category.create({
    data: {
      id: 'cat-drinks',
      name: 'Drinks',
      slug: 'drinks',
      description: 'Refreshing traditional dairy beverages churned fresh daily.',
    },
  });

  // 4. Products & Variants (Using the new images in /products/)
  const productsData = [
    {
      name: 'Fresh Cow Milk',
      slug: 'fresh-cow-milk',
      description: 'Everyday fresh cow milk, collected each morning and chilled immediately for delivery. 100% natural and unadulterated.',
      shortDescription: 'Fresh morning cow milk, chilled below 4°C.',
      categoryId: catMilkYogurt.id,
      imageUrl: '/products/cow-milk.jpg',
      sku: 'SNY-COW-MILK',
      stockQuantity: 200,
      isActive: true,
      isFeatured: true,
      displayOrder: 1,
      variants: [
        { size: '1L', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 100 },
        { size: '2L', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 60 },
        { size: '5L', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 40 },
      ],
    },
    {
      name: 'Fresh Goat Milk',
      slug: 'fresh-goat-milk',
      description: 'Fresh goat milk from a small, healthy herd, handled in small batches for exceptional purity and natural nutrition.',
      shortDescription: 'Pure, wholesome goat milk in small batches.',
      categoryId: catMilkYogurt.id,
      imageUrl: '/products/goat-milk-branded.jpg',
      sku: 'SNY-GOAT-MILK',
      stockQuantity: 100,
      isActive: true,
      isFeatured: true,
      displayOrder: 2,
      variants: [
        { size: '1L', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 50 },
        { size: '2L', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 30 },
        { size: '5L', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 20 },
      ],
    },
    {
      name: 'Fresh Yogurt (Dahi)',
      slug: 'fresh-yogurt-dahi',
      description: 'Thick, naturally cultured creamy Pakistani dahi made from pure whole milk without any artificial gelatin or stabilizers.',
      shortDescription: 'Thick, naturally cultured whole milk dahi.',
      categoryId: catMilkYogurt.id,
      imageUrl: '/products/fresh-yogurt.jpg',
      sku: 'SNY-DAHI',
      stockQuantity: 120,
      isActive: true,
      isFeatured: true,
      displayOrder: 3,
      variants: [
        { size: '500g', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 50 },
        { size: '1kg', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 50 },
        { size: '2kg', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 20 },
      ],
    },
    {
      name: 'Pure Makhan',
      slug: 'pure-makhan',
      description: 'Traditional home churned makhan batches, freshly prepared and chilled for delivery. Made from pure cultured cream.',
      shortDescription: 'Traditional home-churned farm butter.',
      categoryId: catDairy.id,
      imageUrl: '/products/pure-makhan.jpg',
      sku: 'SNY-MAKHAN',
      stockQuantity: 80,
      isActive: true,
      isFeatured: true,
      displayOrder: 4,
      variants: [
        { size: '250g', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 25 },
        { size: '500g', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 30 },
        { size: '1kg', price: 1500.0, priceType: 'CONFIRMED', isAvailable: true, stock: 25 },
      ],
    },
    {
      name: 'Desi Pure Ghee',
      slug: 'desi-pure-ghee',
      description: 'Desi ghee prepared the traditional way, packaged in sealed jars. Slow-cooked over gentle heat for rich golden granules.',
      shortDescription: 'Artisanal slow-cooked golden desi ghee.',
      categoryId: catDairy.id,
      imageUrl: '/products/desi-ghee.jpg',
      sku: 'SNY-GHEE',
      stockQuantity: 90,
      isActive: true,
      isFeatured: true,
      displayOrder: 5,
      variants: [
        { size: '250g', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 30 },
        { size: '500g', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 30 },
        { size: '1kg', price: 2600.0, priceType: 'CONFIRMED', isAvailable: true, stock: 30 },
      ],
    },
    {
      name: 'Fresh Paneer',
      slug: 'fresh-paneer',
      description: 'Soft, unsalted fresh cottage cheese made daily from pure whole cow milk. Moist, supple, and rich in natural protein.',
      shortDescription: 'Soft, unsalted daily fresh cottage cheese.',
      categoryId: catDairy.id,
      imageUrl: '/products/fresh-paneer.jpg',
      sku: 'SNY-PANEER',
      stockQuantity: 60,
      isActive: true,
      isFeatured: false,
      displayOrder: 6,
      variants: [
        { size: '250g', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 20 },
        { size: '500g', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 25 },
        { size: '1kg', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 15 },
      ],
    },
    {
      name: 'Barfi',
      slug: 'barfi',
      description: 'Traditional slow-cooked milk fudge made from pure condensed khoya and infused with delicate aromatic green cardamom.',
      shortDescription: 'Slow-cooked milk fudge made from pure khoya.',
      categoryId: catSweets.id,
      imageUrl: '/products/barfi.jpg',
      sku: 'SNY-BARFI',
      stockQuantity: 50,
      isActive: true,
      isFeatured: false,
      displayOrder: 7,
      variants: [
        { size: '250g', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 20 },
        { size: '500g', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 20 },
        { size: '1kg', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 10 },
      ],
    },
    {
      name: 'Badayuni Peda',
      slug: 'badayuni-peda',
      description: 'Caramelized traditional mawa sweet infused with fragrant green cardamom and slow-roasted to rich caramel perfection.',
      shortDescription: 'Caramelized traditional mawa cardamom sweet.',
      categoryId: catSweets.id,
      imageUrl: '/products/badayuni-peda.jpg',
      sku: 'SNY-PEDA',
      stockQuantity: 50,
      isActive: true,
      isFeatured: false,
      displayOrder: 8,
      variants: [
        { size: '250g', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 20 },
        { size: '500g', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 20 },
        { size: '1kg', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 10 },
      ],
    },
    {
      name: 'Kalakand',
      slug: 'kalakand',
      description: 'Delicate granular milk cake crafted from fresh whole milk and pure soft chhena, melt-in-mouth texture with subtle sweetness.',
      shortDescription: 'Moist, granular milk cake from fresh chhena.',
      categoryId: catSweets.id,
      imageUrl: '/products/kalakand.jpg',
      sku: 'SNY-KALAKAND',
      stockQuantity: 45,
      isActive: true,
      isFeatured: false,
      displayOrder: 9,
      variants: [
        { size: '250g', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 15 },
        { size: '500g', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 20 },
        { size: '1kg', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 10 },
      ],
    },
    {
      name: 'Fresh Rabri',
      slug: 'fresh-rabri',
      description: 'Rich, creamy layered sweet made by simmering whole milk with malai layers and garnished with roasted pistachios.',
      shortDescription: 'Creamy layered sweet simmered with pure malai.',
      categoryId: catSweets.id,
      imageUrl: '/products/fresh-rabri.jpg',
      sku: 'SNY-RABRI',
      stockQuantity: 40,
      isActive: true,
      isFeatured: false,
      displayOrder: 10,
      variants: [
        { size: '250g', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 15 },
        { size: '500g', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 15 },
        { size: '1kg', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 10 },
      ],
    },
    {
      name: 'Fresh Lassi',
      slug: 'fresh-lassi',
      description: 'Classic refreshing Pakistani lassi churned with pure rich dahi, served chilled in traditional style.',
      shortDescription: 'Traditional refreshing churned yogurt drink.',
      categoryId: catDrinks.id,
      imageUrl: '/products/fresh-lassi.jpg',
      sku: 'SNY-LASSI',
      stockQuantity: 80,
      isActive: true,
      isFeatured: false,
      displayOrder: 11,
      variants: [
        { size: '500ml', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 50 },
        { size: '1L', price: null, priceType: 'ON_REQUEST', isAvailable: true, stock: 30 },
      ],
    },
  ];

  for (const p of productsData) {
    const { variants, ...prodFields } = p;
    const created = await prisma.product.create({
      data: {
        ...prodFields,
        variants: {
          create: variants,
        },
      },
    });

    // Also add as main product image
    await prisma.productImage.create({
      data: {
        productId: created.id,
        imageUrl: created.imageUrl,
        isMain: true,
        displayOrder: 1,
      },
    });
  }

  // 5. Official Business Settings (SUNNY Dairy & Sanaullah)
  await prisma.siteSetting.createMany({
    data: [
      { settingKey: 'store_name', settingValue: 'SUNNY Dairy', description: 'Brand and store display name' },
      { settingKey: 'store_owner', settingValue: 'Sanaullah', description: 'Store owner / verified contact' },
      { settingKey: 'store_phone', settingValue: '03449322930', description: 'Business phone for calls' },
      { settingKey: 'whatsapp_number', settingValue: '96895234002', description: 'WhatsApp international number without symbols' },
      { settingKey: 'store_email', settingValue: 'sanaullah.ccs@gmail.com', description: 'Support email address' },
      { settingKey: 'store_address', settingValue: 'SUNNY Dairy Farm, Dera Ismail Khan, Khyber Pakhtunkhwa, Pakistan', description: 'Physical farm address' },
      { settingKey: 'store_logo', settingValue: '/logo.png', description: 'Path to brand logo' },
      { settingKey: 'store_favicon', settingValue: '/logo.png', description: 'Favicon image' },
      { settingKey: 'currency', settingValue: 'PKR', description: 'Default currency code' },
      { settingKey: 'currency_symbol', settingValue: 'Rs.', description: 'Currency display symbol' },
      { settingKey: 'timezone', settingValue: 'Asia/Karachi', description: 'Business timezone' },
      { settingKey: 'tagline', settingValue: 'Fresh milk. Straight from the farm.', description: 'Homepage tagline' },
      { settingKey: 'brand_description', settingValue: 'Collected each morning, chilled and brought to your door. Order in a minute, pay in cash when it arrives.', description: 'Brand subtext' },
      { settingKey: 'default_delivery_fee', settingValue: '100', description: 'Default delivery charges' },
      { settingKey: 'min_order_amount', settingValue: '300', description: 'Minimum order amount' },
      { settingKey: 'free_delivery_threshold', settingValue: '2500', description: 'Order total for free delivery' },
      { settingKey: 'delivery_areas', settingValue: 'Cantt, Circular Road, University Road, Bannu Road, Multan Road, Mandra, Qayyum Nagar, Tank Road', description: 'Active coverage zones' },
      { settingKey: 'announcement_text', settingValue: '🚚 Farm-fresh morning delivery across Dera Ismail Khan! Free delivery on orders over Rs. 2,500.', description: 'Header announcement bar' },
      { settingKey: 'announcement_enabled', settingValue: 'true', description: 'Toggle announcement bar' },
      { settingKey: 'social_instagram', settingValue: 'https://instagram.com/sunnydairy', description: 'Instagram handle' },
      { settingKey: 'social_facebook', settingValue: 'https://facebook.com/sunnydairy', description: 'Facebook handle' },
    ],
  });

  // 6. Delivery Zones with Zone-specific delivery charges
  const zones = [
    { areaName: 'D.I. Khan Cantt Area & Officers Colony', city: 'Dera Ismail Khan', deliveryFee: 100, minOrderAmount: 300, freeDeliveryThreshold: 2500, estimatedMinutes: 30 },
    { areaName: 'Circular Road & Topanwala Gate', city: 'Dera Ismail Khan', deliveryFee: 100, minOrderAmount: 300, freeDeliveryThreshold: 2500, estimatedMinutes: 30 },
    { areaName: 'University Road & Gomal University', city: 'Dera Ismail Khan', deliveryFee: 120, minOrderAmount: 300, freeDeliveryThreshold: 2500, estimatedMinutes: 40 },
    { areaName: 'Bannu Road & Grid Station Area', city: 'Dera Ismail Khan', deliveryFee: 120, minOrderAmount: 300, freeDeliveryThreshold: 2500, estimatedMinutes: 40 },
    { areaName: 'Multan Road & Mandra Area', city: 'Dera Ismail Khan', deliveryFee: 120, minOrderAmount: 300, freeDeliveryThreshold: 2500, estimatedMinutes: 45 },
    { areaName: 'Qayyum Nagar & Zafarabad', city: 'Dera Ismail Khan', deliveryFee: 100, minOrderAmount: 300, freeDeliveryThreshold: 2500, estimatedMinutes: 35 },
    { areaName: 'Tank Road & Murial Sector', city: 'Dera Ismail Khan', deliveryFee: 150, minOrderAmount: 400, freeDeliveryThreshold: 3000, estimatedMinutes: 50 },
    { areaName: 'Commissionery Bazaar & City Center', city: 'Dera Ismail Khan', deliveryFee: 100, minOrderAmount: 300, freeDeliveryThreshold: 2500, estimatedMinutes: 30 },
  ];

  for (const z of zones) {
    await prisma.deliveryZone.create({ data: z });
  }

  // 8. CMS Sections
  await prisma.cmsSection.createMany({
    data: [
      {
        sectionKey: 'hero',
        title: 'Fresh milk. Straight from the farm.',
        subtitle: 'MILK, MAKHAN & GHEE · PAKISTAN',
        content: 'Collected each morning, chilled and brought to your door. Order in a minute, pay in cash when it arrives.',
        imageUrl: '/products/hero-farm.jpg',
        buttonText: 'Shop Now',
        buttonLink: '#shop-catalog',
        isEnabled: true,
      },
      {
        sectionKey: 'trust_banner',
        title: 'Why Choose SUNNY Dairy',
        content: JSON.stringify([
          { title: 'Collected fresh', desc: 'Milk collected daily at morning, zero preservatives or additives.' },
          { title: 'Kept cool', desc: 'Chilled in food-grade stainless tanks below 4°C immediately.' },
          { title: 'Pay on delivery', desc: 'Pay in cash or easy digital transfer only when your order arrives.' },
        ]),
        isEnabled: true,
      },
      {
        sectionKey: 'about',
        title: 'Our Promise: Pure, unadulterated dairy as nature intended.',
        content: 'At SUNNY Dairy, we never dilute our milk with water or chemicals. Founded by Sanaullah with a simple standard: we only deliver what we feed our own family.',
        imageUrl: '/products/hero-farm.jpg',
        buttonText: 'Read Our Full Quality Standard',
        buttonLink: '/our-promise',
        isEnabled: true,
      },
    ],
  });

  console.log('Seeding completed successfully! 0 fake orders; clean database with SUNNY Dairy branding.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
