const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Read blog posts directly from blogPosts.ts
const blogPostsPath = path.join(__dirname, '..', 'src', 'data', 'blogPosts.ts');
const fileContent = fs.readFileSync(blogPostsPath, 'utf8');

// Quick parser for the BLOG_POSTS array exported from the typescript file
// Since it's a TS file with HTML template strings, let's extract the array or compile it
async function main() {
  console.log('Seeding initial 5 SEO blog posts into SQLite database...');
  
  // We can require it using ts-node or a lightweight evaluation, or read the structured data
  // Let's create an entry for each of the 5 articles
  const posts = [
    {
      slug: 'how-to-check-pure-desi-ghee-at-home',
      title: 'How to Check Pure Desi Ghee vs. Fake Ghee at Home (5 Easy Purity Tests)',
      metaTitle: 'How to Test Pure Desi Ghee at Home (5 Tests) | SUNNY Dairy',
      metaDescription: 'Learn 5 simple tests to identify 100% pure organic clarified butter (desi ghee) at home. Spot vegetable fat adulteration and verify authentic aroma and texture.',
      keywords: 'pure desi ghee in Pakistan, pure clarified butter quality test, organic ghee Oman, how to check pure desi ghee at home, ghee purity test iodine, original desi ghee verification, pure cow ghee benefits Muscat',
      summary: 'Adulteration in commercial cooking fats is a growing concern. Discover 5 reliable, kitchen-tested methods to verify that your clarified butter (desi ghee) is 100% authentic, unadulterated, and rich in natural nutrients.',
      coverImage: '/products/desi-ghee.jpg',
      imageAlt: 'Pure clarified butter artisanal desi ghee in glass jar tested for 100 percent natural purity',
      category: 'Purity & Quality Guides',
      authorName: 'Sanaullah',
      authorRole: 'Master Dairy Farm Manager',
      authorAvatar: '/profile.jpg',
      readTime: '6 min read',
      isPublished: true,
      isFeatured: true,
      displayOrder: 1,
      publishedDate: new Date('2026-11-10T08:00:00Z'),
      relatedProductSlug: 'pure-clarified-butter-artisanal-ghee',
      relatedProductName: 'Pure Clarified Butter (Artisanal Ghee)',
      faqsJson: JSON.stringify([
        {
          question: 'How long does pure clarified butter (desi ghee) last at room temperature?',
          answer: 'When prepared with zero water dilution and properly cooked, pure clarified butter has an indefinite shelf life of at least 12 to 18 months without refrigeration, provided it is kept in an airtight, dry glass container away from direct sunlight.'
        },
        {
          question: 'Why does pure desi ghee solidify with a grainy, granular texture?',
          answer: 'The natural crystallization of triglycerides during slow cooling creates the prized granular (danedar) texture. Counterfeit fats prepared with hydrogenated oils or paraffin often solidify into an unnaturally smooth, greasy block.'
        },
        {
          question: 'Is pure desi ghee safe for individuals with lactose intolerance?',
          answer: 'Yes! During the traditional slow-simmering process, virtually all lactose and casein proteins precipitate out and are filtered away, making authentic clarified butter naturally lactose-free and gut-friendly.'
        }
      ]),
      contentHtml: `<p class="lead text-lg text-forest-700 leading-relaxed font-sans mb-6">
Pure clarified butter (traditionally celebrated as <strong>Desi Ghee</strong>) has been revered across South Asia and the Middle East for millennia. It is an indispensable culinary staple that enriches morning parathas, aromatic rice dishes, and traditional sweets while providing fat-soluble vitamins (A, D, E, and K2) and gut-healing butyric acid. However, with skyrocketing commercial demand, markets in Pakistan and Oman have seen a flood of adulterated products mixed with industrial palm stearin, hydrogenated vegetable fats, animal tallow, and synthetic aromas.
</p>
<h2 class="text-2xl font-serif font-bold text-forest-900 mt-8 mb-4">Why Verifying Clarified Butter Purity Is Essential for Your Family</h2>
<p class="text-forest-800 leading-relaxed mb-4">
Unlike industrial cooking oils processed with harsh solvent extractions and high heat, pure clarified butter is produced by slowly simmering cultured whole-milk butter until all moisture evaporates and milk proteins caramelize gently at the bottom. The resulting golden liquid is free of trans fats, lactose, and oxidized cholesterol. Consuming counterfeit ghee loaded with industrial hydrogenated vegetable oils introduces dangerous trans fats that spike LDL cholesterol and trigger arterial inflammation.
</p>
<p class="text-forest-800 leading-relaxed mb-6">
At <strong>SUNNY Dairy</strong>, our clarified butter begins with our <em>Zero Water Dilution</em> raw milk, churned each morning into cultured farm butter before being slow-simmered over low embers in small batches. Here are 5 dependable tests you can perform at home in under ten minutes to verify the integrity of your butter.
</p>
<div class="my-8 p-6 bg-cream-50 border-l-4 border-gold-500 rounded-r-xl shadow-sm">
  <h3 class="text-xl font-serif font-bold text-forest-900 mb-2">SUNNY Dairy Quality Standard</h3>
  <p class="text-sm text-forest-700 mb-0 leading-relaxed">
    We practice zero-tolerance quality inspection. Every single jar of our artisanal clarified butter is prepared without additives, artificial food dyes, or vegetable oils. Certified farm-fresh delivery across Dera Ismail Khan, nationwide Pakistan, and Oman.
  </p>
</div>
<h2 class="text-2xl font-serif font-bold text-forest-900 mt-8 mb-4">Test 1: The Rapid Pan Heat & Color Test</h2>
<p class="text-forest-800 leading-relaxed mb-4">The heat test is the quickest way to observe how the fat behaves at elevated temperatures.</p>
<ol class="list-decimal pl-6 space-y-2 text-forest-800 mb-6">
  <li>Place a small stainless steel pan over medium heat for one minute.</li>
  <li>Add one teaspoon of clarified butter directly to the hot pan surface.</li>
  <li><strong>Pure Butter Reaction:</strong> Genuine clarified butter will melt almost instantly, liquefying in under 3 seconds and turning a rich golden-amber to light reddish-brown with a fragrant aroma.</li>
  <li><strong>Fake / Adulterated Reaction:</strong> Adulterated fat takes longer to melt, bubbles aggressively due to trapped water, and turns a pale yellow or whitish hue.</li>
</ol>
<h2 class="text-2xl font-serif font-bold text-forest-900 mt-8 mb-4">Test 2: The Palm Body-Temperature Melt Test</h2>
<p class="text-forest-800 leading-relaxed mb-4">The melting point of genuine bovine clarified butter lies precisely between 32°C and 35°C—just below normal human body temperature (37°C).</p>
<ul class="list-disc pl-6 space-y-2 text-forest-800 mb-6">
  <li>Take a half teaspoon of semi-solid clarified butter and place it in the center of your clean, open palm.</li>
  <li>Keep your palm still for 15 to 20 seconds.</li>
  <li><strong>Pure Result:</strong> Genuine clarified butter absorbs body heat immediately and melts into a silky liquid without rubbing.</li>
  <li><strong>Adulterated Result:</strong> If the butter stays solid or waxy on your skin, it has been cut with hydrogenated vegetable shortening (melting point > 42°C) or animal tallow.</li>
</ul>
<h2 class="text-2xl font-serif font-bold text-forest-900 mt-8 mb-4">Test 3: The Iodine Starch Detection Test</h2>
<p class="text-forest-800 leading-relaxed mb-4">Unscrupulous manufacturers frequently add boiled potato starch or corn flour to increase volume and simulate granular texture.</p>
<ul class="list-disc pl-6 space-y-2 text-forest-800 mb-6">
  <li>Melt two tablespoons of clarified butter in a transparent glass cup.</li>
  <li>Add 2 to 3 drops of standard pharmaceutical iodine solution (available at any pharmacy).</li>
  <li>Gently swirl the mixture.</li>
  <li><strong>Pure Result:</strong> The golden color of the ghee remains unchanged.</li>
  <li><strong>Contaminated Result:</strong> The mixture instantly turns deep purple or blue-black, proving the presence of added starches.</li>
</ul>
<h2 class="text-2xl font-serif font-bold text-forest-900 mt-8 mb-4">Test 4: The Refrigeration Double-Layer Test</h2>
<p class="text-forest-800 leading-relaxed mb-4">Different fats possess different densities and freezing points. This test exposes blends of different oils.</p>
<ul class="list-disc pl-6 space-y-2 text-forest-800 mb-6">
  <li>Gently melt 50ml of clarified butter in a clean glass jar.</li>
  <li>Place the jar in your refrigerator (4°C) for 2 to 3 hours until completely solid.</li>
  <li>Inspect the solidified fat under bright light.</li>
  <li><strong>Pure Result:</strong> A single, uniform, golden-yellow mass with consistent granular texture throughout.</li>
  <li><strong>Adulterated Result:</strong> Distinct horizontal layers form, indicating separate settling of cheap oils and industrial palm fractions.</li>
</ul>
<h2 class="text-2xl font-serif font-bold text-forest-900 mt-8 mb-4">Test 5: The Hydrochloric Acid & Sugar Test (Baudouin Test)</h2>
<p class="text-forest-800 leading-relaxed mb-6">In South Asia, vegetable shortening (vanaspati) is legally required to contain 5% sesame oil. Mixing melted ghee with concentrated hydrochloric acid and a pinch of sugar triggers a crimson-red dye reaction if sesame oil is detected.</p>`
    },
    {
      slug: 'health-benefits-of-drinking-farm-fresh-milk',
      title: '7 Proven Health Benefits of Drinking Farm-Fresh Raw Milk Every Morning',
      metaTitle: '7 Benefits of Farm-Fresh Raw Milk Every Morning | SUNNY Dairy',
      metaDescription: 'Discover why unadulterated whole cow milk collected at dawn and delivered chilled below 4°C provides superior bioavailable calcium, digestive enzymes, and vitality.',
      keywords: 'fresh cow milk delivery, benefits of pure milk, farm fresh milk Pakistan, farm milk delivery Muscat, raw cow milk benefits, zero water adulteration milk, morning milk delivery DI Khan',
      summary: 'Starting your morning with unadulterated, whole farm-fresh milk provides high-bioavailability calcium, natural digestive enzymes, and essential fat-soluble vitamins that commercial ultra-processed milk strips away.',
      coverImage: '/products/fresh-milk.jpg',
      imageAlt: 'Bottle of pure farm fresh whole milk in morning sunshine with clean drinking glass',
      category: 'Nutrition & Wellness',
      authorName: 'Sanaullah',
      authorRole: 'Master Dairy Farm Manager',
      authorAvatar: '/profile.jpg',
      readTime: '7 min read',
      isPublished: true,
      isFeatured: false,
      displayOrder: 2,
      publishedDate: new Date('2026-11-08T08:00:00Z'),
      relatedProductSlug: 'farm-fresh-cow-milk',
      relatedProductName: 'Farm-Fresh Whole Cow Milk',
      faqsJson: JSON.stringify([
        {
          question: 'Should I boil farm-fresh milk before drinking?',
          answer: 'Yes. We recommend gently bringing fresh milk to a rolling boil for 2 to 3 minutes, then allowing it to cool naturally. This ensures complete food safety while preserving natural fat globules and nutritional density.'
        },
        {
          question: 'How is SUNNY Dairy milk different from supermarket UHT carton milk?',
          answer: 'Supermarket carton milk undergoes ultra-high-temperature (135°C+) processing that denatures enzymes and homogenizes fat globules into artificial micro-particles. SUNNY Dairy is 100% natural whole milk chilled immediately to 4°C with zero water added.'
        }
      ]),
      contentHtml: `<p class="lead text-lg text-forest-700 leading-relaxed font-sans mb-6">
For generations, the morning routine across healthy pastoral communities began with a glass of fresh, creamy milk drawn at dawn from grass-fed cows. In today's industrialized world, however, supermarket shelves are packed with ultra-high-temperature (UHT) carton milk stripped of natural fat, reconstituted with imported milk powders, and preserved for months at room temperature.
</p>
<h2 class="text-2xl font-serif font-bold text-forest-900 mt-8 mb-4">1. Maximum Bioavailable Calcium and Vitamin D3</h2>
<p class="text-forest-800 leading-relaxed mb-4">
Whole farm milk contains calcium bound naturally with organic phosphorus and milk fats, allowing your body to absorb up to 80% more elemental calcium compared to synthetic fortified alternatives.
</p>
<h2 class="text-2xl font-serif font-bold text-forest-900 mt-8 mb-4">2. Intact Digestive Enzymes (Lactase and Lipase)</h2>
<p class="text-forest-800 leading-relaxed mb-4">
Freshly drawn unpasteurized milk contains native enzymes such as lactase and phosphatase that facilitate smooth digestion and nutrient assimilation.
</p>
<h2 class="text-2xl font-serif font-bold text-forest-900 mt-8 mb-4">3. High Concentration of Conjugated Linoleic Acid (CLA)</h2>
<p class="text-forest-800 leading-relaxed mb-4">
Cattle pastured on green fodder produce milk with significantly higher concentrations of CLA, an omega-6 fatty acid proven to support metabolic health and reduce systemic inflammation.
</p>
<h2 class="text-2xl font-serif font-bold text-forest-900 mt-8 mb-4">4. Zero Chemical Preservatives and Synthetic Stabilizers</h2>
<p class="text-forest-800 leading-relaxed mb-4">
At SUNNY Dairy, our milk goes directly from the morning milking cycle into food-grade stainless steel chilling tanks below 4°C, reaching your door in airtight glass bottles.
</p>`
    },
    {
      slug: 'clarified-butter-desi-ghee-vs-cooking-oil',
      title: 'Clarified Butter (Desi Ghee) vs. Vegetable Cooking Oil: Which is Better for Your Heart & Family?',
      metaTitle: 'Clarified Butter (Desi Ghee) vs Cooking Oil Comparison | SUNNY Dairy',
      metaDescription: 'Discover why traditional clarified butter outperforms industrial seed and vegetable oils in smoke point, stability, gut health, and cardiovascular wellness.',
      keywords: 'pure desi ghee benefits, healthy cooking fat Pakistan, clarified butter vs vegetable oil, desi ghee price Karachi, smoke point ghee, heart healthy cooking fat Oman',
      summary: 'A comprehensive, science-backed comparison between pure clarified butter and refined industrial seed oils. Discover why traditional ghee is safer for high-heat cooking, digestion, and cardiovascular wellness.',
      coverImage: '/products/makhan.jpg',
      imageAlt: 'Clay bowl of traditional churned white butter makhan before slow simmering into pure clarified butter',
      category: 'Nutrition & Wellness',
      authorName: 'Sanaullah',
      authorRole: 'Master Dairy Farm Manager',
      authorAvatar: '/profile.jpg',
      readTime: '6 min read',
      isPublished: true,
      isFeatured: false,
      displayOrder: 3,
      publishedDate: new Date('2026-11-05T08:00:00Z'),
      relatedProductSlug: 'pure-clarified-butter-artisanal-ghee',
      relatedProductName: 'Pure Clarified Butter (Artisanal Ghee)',
      faqsJson: JSON.stringify([
        {
          question: 'Can clarified butter help with weight loss?',
          answer: 'Yes, in moderation. Clarified butter contains medium-chain triglycerides (MCTs) that the liver burns directly for immediate energy rather than storing as adipose tissue.'
        }
      ]),
      contentHtml: `<p class="lead text-lg text-forest-700 leading-relaxed font-sans mb-6">
For decades, commercial advertising claimed that industrial seed oils were superior to traditional animal fats. Today, nutritional science is confirming what traditional wisdom has known for centuries: pure clarified butter is one of the most stable, nutrient-dense cooking fats on Earth.
</p>
<h2 class="text-2xl font-serif font-bold text-forest-900 mt-8 mb-4">High Smoke Point: 250°C (482°F)</h2>
<p class="text-forest-800 leading-relaxed mb-4">
Because milk solids and water have been removed, pure clarified butter withstands deep-frying and high-temperature sautéing without oxidizing or generating carcinogenic free radicals.
</p>
<h2 class="text-2xl font-serif font-bold text-forest-900 mt-8 mb-4">Rich in Gut-Healing Butyric Acid</h2>
<p class="text-forest-800 leading-relaxed mb-4">
Butyrate is the primary fuel for the cells lining your colon. Clarified butter is one of the richest dietary sources of butyric acid in nature.
</p>`
    },
    {
      slug: 'traditional-pakistani-mithai-pure-khoya-sweets',
      title: 'Traditional Pakistani Sweets Made with Pure Khoya: Why Quality Matters',
      metaTitle: 'Traditional Khoya Sweets & Artisanal Confectionery | SUNNY Dairy',
      metaDescription: 'Learn how authentic Pakistani sweets crafted from pure evaporated milk solids (khoya) differ from commercial sweets adulterated with vegetable fats and artificial flavors.',
      keywords: 'pure khoya sweets online, traditional sweets Pakistan, Pakistani confectionery in Oman, authentic halwa delivery, pure milk sweets Muscat, gulab jamun khoya DI Khan',
      summary: 'Explore the culinary heritage of traditional milk sweets crafted exclusively with pure evaporated whole milk solids (khoya). Why 100% natural dairy elevates flavor, aroma, and festive traditions.',
      coverImage: '/products/sohan-halwa.jpg',
      imageAlt: 'Authentic traditional confectionery handcrafted with pure evaporated milk khoya and roasted nuts',
      category: 'Farm Traditions & Heritage',
      authorName: 'Sanaullah',
      authorRole: 'Master Dairy Farm Manager',
      authorAvatar: '/profile.jpg',
      readTime: '5 min read',
      isPublished: true,
      isFeatured: false,
      displayOrder: 4,
      publishedDate: new Date('2026-11-02T08:00:00Z'),
      relatedProductSlug: 'artisanal-traditional-sweet-fudge',
      relatedProductName: 'Artisanal Traditional Sweet Confectionery',
      faqsJson: JSON.stringify([
        {
          question: 'Do your traditional sweets contain artificial food coloring?',
          answer: 'Never. Our traditional sweets achieve their rich caramel hues naturally from slow caramelization of milk sugars and pure saffron strands.'
        }
      ]),
      contentHtml: `<p class="lead text-lg text-forest-700 leading-relaxed font-sans mb-6">
In Pakistani and Middle Eastern hospitality, no celebration, Eid, or wedding is complete without traditional milk sweets. However, commercial mass-production has replaced authentic khoya with powdered mixes, synthetic flavorings, and industrial hydrogenated fats.
</p>
<h2 class="text-2xl font-serif font-bold text-forest-900 mt-8 mb-4">The Art of Slow-Simmered Khoya</h2>
<p class="text-forest-800 leading-relaxed mb-4">
Authentic khoya requires simmering whole milk in heavy iron pans for hours while continuously stirring, reducing liquid volume until only dense, rich milk solids remain.
</p>`
    },
    {
      slug: 'why-cold-chain-chilled-milk-is-safer-than-open-loose-milk',
      title: 'Why Cold-Chain Chilled Milk is Safer and Fresher Than Open Loose Milk',
      metaTitle: 'Cold-Chain Chilled Milk vs Open Loose Milk | SUNNY Dairy',
      metaDescription: 'Discover why temperature-controlled cold-chain delivery below 4°C prevents bacterial proliferation, protecting your family from contamination in raw milk.',
      keywords: 'hygienic milk home delivery, zero water dilution milk, fresh dairy farm DI Khan, safe unadulterated milk Lahore, cold chain dairy delivery Pakistan, raw cow milk hygiene',
      summary: 'Discover how unbroken cold-chain logistics from the morning milking cycle to your doorstep prevents bacterial spoilage and guarantees the freshest, purest dairy experience.',
      coverImage: '/products/fresh-milk.jpg',
      imageAlt: 'Stainless steel milk chilling tank maintaining dairy freshness below 4 degrees Celsius',
      category: 'Purity & Quality Guides',
      authorName: 'Sanaullah',
      authorRole: 'Master Dairy Farm Manager',
      authorAvatar: '/profile.jpg',
      readTime: '5 min read',
      isPublished: true,
      isFeatured: false,
      displayOrder: 5,
      publishedDate: new Date('2026-10-28T08:00:00Z'),
      relatedProductSlug: 'farm-fresh-cow-milk',
      relatedProductName: 'Farm-Fresh Whole Cow Milk',
      faqsJson: JSON.stringify([
        {
          question: 'What temperature is SUNNY Dairy milk kept at during delivery?',
          answer: 'Our milk is cooled below 4°C immediately following milking and transported in insulated cold-storage containers right to your doorstep.'
        }
      ]),
      contentHtml: `<p class="lead text-lg text-forest-700 leading-relaxed font-sans mb-6">
Across urban Pakistan, millions of families still buy loose milk delivered in open galvanized metal drums mounted on motorbikes. Exposed to dust, exhaust fumes, and scorching ambient temperatures, this milk faces severe contamination risks.
</p>
<h2 class="text-2xl font-serif font-bold text-forest-900 mt-8 mb-4">The Danger of Ambient Temperature Bacterial Growth</h2>
<p class="text-forest-800 leading-relaxed mb-4">
Bacteria in fresh milk double every twenty minutes when kept above 10°C. Cold-chain storage below 4°C suspends bacterial activity without requiring chemical preservatives.
</p>`
    }
  ];

  for (const p of posts) {
    await prisma.blogPost.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
    console.log(`✓ Seeded blog: "${p.title}"`);
  }

  const finalCount = await prisma.blogPost.count();
  console.log(`\nAll 5 SEO blog posts successfully populated in database! Total count: ${finalCount}`);
}

main()
  .catch((e) => {
    console.error('Error seeding blogs:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
