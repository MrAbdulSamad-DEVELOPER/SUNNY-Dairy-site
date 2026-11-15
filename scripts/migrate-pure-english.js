const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateToPureEnglish() {
  console.log('Migrating products and categories to 100% pure English...');

  // Update Categories
  const categoryUpdates = [
    {
      slug: 'milk-and-yogurt',
      name: 'Milk & Cultured Yogurt',
      description: 'Pure, fresh farm milk collected each morning and naturally cultured wholesome whole-milk yogurt.',
    },
    {
      slug: 'dairy-products',
      name: 'Farm Butter & Clarified Ghee',
      description: 'Pure churned farm butter, artisanal slow-cooked clarified butter (desi ghee), and fresh cottage cheese.',
    },
    {
      slug: 'traditional-sweets',
      name: 'Traditional Confectionery & Milk Sweets',
      description: 'Artisanal traditional milk sweets prepared with pure condensed milk solids, green cardamom, and fresh farm milk.',
    },
    {
      slug: 'drinks',
      name: 'Chilled Dairy Beverages',
      description: 'Refreshing traditional dairy beverages churned fresh daily from pure cultured yogurt.',
    },
  ];

  for (const cat of categoryUpdates) {
    await prisma.category.updateMany({
      where: { slug: cat.slug },
      data: { name: cat.name, description: cat.description },
    });
  }

  // Update Products
  const productUpdates = [
    {
      matchSlug: 'fresh-cow-milk',
      name: 'Fresh Cow Milk',
      slug: 'fresh-cow-milk',
      description: 'Everyday fresh whole cow milk, collected each morning at dawn and chilled immediately below 4°C for delivery. 100% natural, unadulterated, with zero water dilution.',
      shortDescription: 'Fresh morning whole cow milk, chilled below 4°C with rich natural cream.',
    },
    {
      matchSlug: 'fresh-goat-milk',
      name: 'Fresh Goat Milk',
      slug: 'fresh-goat-milk',
      description: 'Fresh goat milk from a healthy pasture-fed herd, handled in small batches for exceptional purity, easy digestion, and natural whole nutrition.',
      shortDescription: 'Pure, wholesome goat milk handled in small batches.',
    },
    {
      matchSlug: 'fresh-yogurt-dahi',
      name: 'Fresh Cultured Yogurt',
      slug: 'fresh-cultured-yogurt',
      description: 'Thick, naturally cultured whole milk yogurt prepared from pure whole milk without any artificial gelatin, preservatives, or synthetic stabilizers.',
      shortDescription: 'Thick, naturally cultured whole milk fresh yogurt.',
    },
    {
      matchSlug: 'pure-makhan',
      name: 'Pure Churned Farm Butter',
      slug: 'pure-churned-farm-butter',
      description: 'Traditional handcrafted farm butter batches, freshly churned from pure cultured morning cream and chilled for rapid delivery.',
      shortDescription: 'Traditional home-churned fresh farm butter.',
    },
    {
      matchSlug: 'desi-pure-ghee',
      name: 'Pure Clarified Butter (Artisanal Ghee)',
      slug: 'pure-clarified-butter-artisanal-ghee',
      description: 'Pure clarified butter prepared the traditional artisanal way, packaged in sealed glass jars. Slow-cooked over gentle embers for rich golden granules and high smoke point (250°C).',
      shortDescription: 'Artisanal slow-cooked golden clarified butter.',
    },
    {
      matchSlug: 'fresh-paneer',
      name: 'Fresh Artisanal Cottage Cheese (Paneer)',
      slug: 'fresh-artisanal-cottage-cheese-paneer',
      description: 'Soft, unsalted fresh cottage cheese made daily from pure whole cow milk. Moist, supple, and rich in natural bioavailable protein.',
      shortDescription: 'Soft, unsalted daily fresh whole-milk cottage cheese.',
    },
    {
      matchSlug: 'barfi',
      name: 'Traditional Cardamom Milk Fudge',
      slug: 'traditional-cardamom-milk-fudge',
      description: 'Traditional slow-cooked milk fudge made exclusively from pure condensed milk solids and infused with delicate aromatic green cardamom. Zero vegetable fats.',
      shortDescription: 'Slow-cooked milk fudge made from pure condensed milk solids.',
    },
    {
      matchSlug: 'badayuni-peda',
      name: 'Caramelized Cardamom Milk Rounds',
      slug: 'caramelized-cardamom-milk-rounds',
      description: 'Caramelized traditional milk rounds infused with fragrant green cardamom and slow-roasted milk solids to rich caramel perfection.',
      shortDescription: 'Caramelized traditional slow-roasted milk cardamom sweet.',
    },
    {
      matchSlug: 'kalakand',
      name: 'Granular Milk Cake',
      slug: 'granular-milk-cake',
      description: 'Delicate granular milk cake crafted from fresh whole milk and pure soft fresh curd cheese, melt-in-mouth texture with subtle sweetness.',
      shortDescription: 'Moist, granular milk cake crafted from fresh curd cheese.',
    },
    {
      matchSlug: 'fresh-rabri',
      name: 'Layered Clotted Cream Dessert',
      slug: 'layered-clotted-cream-dessert',
      description: 'Rich, creamy layered sweet made by simmering whole milk into delicate clotted cream layers and garnished with roasted pistachios and almonds.',
      shortDescription: 'Creamy layered sweet simmered with pure clotted cream.',
    },
    {
      matchSlug: 'fresh-lassi',
      name: 'Chilled Churned Yogurt Drink',
      slug: 'chilled-churned-yogurt-drink',
      description: 'Classic refreshing churned yogurt beverage whipped from pure rich whole milk yogurt, served chilled in traditional style.',
      shortDescription: 'Traditional refreshing churned whole yogurt beverage.',
    },
  ];

  for (const item of productUpdates) {
    const existing = await prisma.product.findFirst({
      where: {
        OR: [{ slug: item.matchSlug }, { slug: item.slug }],
      },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          name: item.name,
          slug: item.slug,
          description: item.description,
          shortDescription: item.shortDescription,
        },
      });
      console.log(`Updated product: ${item.name} (${item.slug})`);
    } else {
      console.log(`Product not found for: ${item.matchSlug}`);
    }
  }

  // Update CMS section hero subtitle if needed
  await prisma.cmsSection.updateMany({
    where: { sectionKey: 'hero' },
    data: {
      subtitle: 'FRESH MILK, BUTTER & CLARIFIED BUTTER · PAKISTAN & OMAN',
      content: 'Collected each morning at dawn, chilled below 4°C, and delivered to your doorstep across Dera Ismail Khan, nationwide Pakistan, and Oman. Pure unadulterated goodness.',
    },
  });

  console.log('Migration to 100% pure English complete.');
  await prisma.$disconnect();
}

migrateToPureEnglish().catch((err) => {
  console.error(err);
  process.exit(1);
});
