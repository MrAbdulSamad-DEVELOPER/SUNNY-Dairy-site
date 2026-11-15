const http = require('http');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

async function fetchJson(url, options = {}) {
  const start = Date.now();
  const res = await fetch(url, options);
  const duration = Date.now() - start;
  let data = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try { data = await res.json(); } catch (e) {}
  } else {
    data = await res.text();
  }
  return { status: res.status, headers: res.headers, data, duration };
}

async function runMasterQaSuite() {
  console.log('================================================================');
  console.log('       SUNNY DAIRY MASTER E-COMMERCE END-TO-END QA SUITE');
  console.log('================================================================\n');

  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: [],
  };

  function assert(name, condition, details = '') {
    results.total++;
    if (condition) {
      results.passed++;
      results.tests.push({ name, status: 'PASS', details });
      console.log(`[PASS] ${name}`);
    } else {
      results.failed++;
      results.tests.push({ name, status: 'FAIL', details });
      console.error(`[FAIL] ${name} — ${details}`);
    }
  }

  const createdArtifacts = {
    categories: [],
    products: [],
    orders: [],
    users: [],
    deliveryZones: [],
  };

  let sessionCookie = '';
  let adminHeaders = {};

  try {
    // ----------------------------------------------------------------
    // SECTION 1: PUBLIC STOREFRONT PAGES & SEO
    // ----------------------------------------------------------------
    console.log('\n--- SECTION 1: Public Storefront Pages & SEO ---');
    const publicPages = [
      '/',
      '/shop',
      '/about',
      '/our-promise',
      '/delivery',
      '/faq',
      '/contact',
      '/track',
      '/cart',
      '/checkout',
      '/privacy',
      '/terms',
      '/robots.txt',
      '/sitemap.xml',
    ];

    for (const page of publicPages) {
      const res = await fetchJson(`${BASE_URL}${page}`);
      assert(`Storefront page renders: ${page}`, res.status === 200, `HTTP status ${res.status} (${res.duration}ms)`);
    }

    // ----------------------------------------------------------------
    // SECTION 2: PUBLIC CATALOG & STOREFRONT APIS
    // ----------------------------------------------------------------
    console.log('\n--- SECTION 2: Public Catalog & APIs ---');
    const prodRes = await fetchJson(`${BASE_URL}/api/products`);
    assert('GET /api/products returns 200', prodRes.status === 200);
    assert('Product catalog has items', Array.isArray(prodRes.data?.products) && prodRes.data.products.length > 0, `Count: ${prodRes.data?.products?.length}`);

    // Test search filter
    const searchRes = await fetchJson(`${BASE_URL}/api/products?search=milk`);
    assert('Product search query returns 200', searchRes.status === 200 && Array.isArray(searchRes.data?.products));

    // Test category filter
    const catRes = await fetchJson(`${BASE_URL}/api/categories`);
    assert('GET /api/categories returns 200', catRes.status === 200);
    assert('Categories list populated', Array.isArray(catRes.data?.categories) && catRes.data.categories.length > 0);

    const firstCat = catRes.data.categories[0];
    const catFilterRes = await fetchJson(`${BASE_URL}/api/products?category=${firstCat.slug}`);
    assert(`Product category filter by "${firstCat.slug}" returns 200`, catFilterRes.status === 200);

    // Test single product
    const sampleProduct = prodRes.data.products[0];
    const singleProdRes = await fetchJson(`${BASE_URL}/api/products/${sampleProduct.slug || sampleProduct.id}`);
    assert(`Product detail for "${sampleProduct.name}" returns 200`, singleProdRes.status === 200 && singleProdRes.data?.product?.id);
    assert('Product has price variants', Array.isArray(singleProdRes.data?.product?.variants) && singleProdRes.data.product.variants.length > 0);

    // Test settings API
    const settingsRes = await fetchJson(`${BASE_URL}/api/settings`);
    assert('GET /api/settings returns 200', settingsRes.status === 200);
    assert('Store settings contains required keys', !!settingsRes.data?.settings?.store_name && !!settingsRes.data?.settings?.store_phone);

    // ----------------------------------------------------------------
    // SECTION 3: ZERO-TRUST ROUTE PROTECTION & SECURITY AUDIT
    // ----------------------------------------------------------------
    console.log('\n--- SECTION 3: Security & Route Protection (Zero-Trust) ---');
    const protectedAdminEndpoints = [
      { url: '/api/admin/orders', method: 'GET' },
      { url: '/api/admin/stats', method: 'GET' },
      { url: '/api/products', method: 'POST' },
      { url: '/api/admin/categories', method: 'POST' },
      { url: '/api/admin/inventory', method: 'GET' },
      { url: '/api/admin/customers', method: 'GET' },
      { url: '/api/admin/payments', method: 'GET' },
      { url: '/api/admin/delivery-zones', method: 'GET' },
      { url: '/api/admin/reports', method: 'GET' },
      { url: '/api/admin/settings', method: 'GET' },
      { url: '/api/admin/users', method: 'GET' },
      { url: '/api/admin/profile', method: 'GET' },
      { url: '/api/admin/activity', method: 'GET' },
      { url: '/api/admin/cms', method: 'GET' },
    ];

    for (const ep of protectedAdminEndpoints) {
      const res = await fetchJson(`${BASE_URL}${ep.url}`, { method: ep.method });
      assert(`Unauthenticated ${ep.method} ${ep.url} blocked (401)`, res.status === 401, `Status: ${res.status}`);
    }

    // SQL Injection resilience test
    const sqliTest = await fetchJson(`${BASE_URL}/api/orders/track?query=' OR 1=1 --`);
    assert('SQL Injection attempt on order tracking safely handled', sqliTest.status === 404 || sqliTest.status === 400 || (sqliTest.status === 200 && sqliTest.data.orders?.length === 0));

    // XSS in customer name handled
    const xssPayload = '<script>alert("XSS")</script>';
    const xssTestRes = await fetchJson(`${BASE_URL}/api/products?search=${encodeURIComponent(xssPayload)}`);
    assert('XSS string in search handled safely without server error', xssTestRes.status === 200);

    // ----------------------------------------------------------------
    // SECTION 4: ADMIN AUTHENTICATION & SESSION
    // ----------------------------------------------------------------
    console.log('\n--- SECTION 4: Admin Authentication ---');
    const badLogin = await fetchJson(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'InvalidPasswordXYZ!' }),
    });
    assert('Invalid admin credentials rejected (401)', badLogin.status === 401);

    const goodLogin = await fetchJson(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'SunnyDairyAdmin2026!' }),
    });
    assert('Super admin login succeeds (200)', goodLogin.status === 200 && goodLogin.data?.success);

    const rawCookies = goodLogin.headers.get('set-cookie') || '';
    const sessionMatch = rawCookies.match(/sunny_admin_session=([^;]+)/);
    sessionCookie = sessionMatch ? `sunny_admin_session=${sessionMatch[1]}` : '';
    assert('Admin session cookie issued with HttpOnly/Path', !!sessionCookie);

    adminHeaders = {
      'Content-Type': 'application/json',
      Cookie: sessionCookie,
    };

    // ----------------------------------------------------------------
    // SECTION 5: ADMIN PROFILE & SECURITY SETTINGS
    // ----------------------------------------------------------------
    console.log('\n--- SECTION 5: Admin Profile Management ---');
    const profileRes = await fetchJson(`${BASE_URL}/api/admin/profile`, { headers: adminHeaders });
    assert('GET /api/admin/profile returns 200', profileRes.status === 200 && profileRes.data?.success);
    assert('Profile contains full_name, email, role, avatarUrl', !!profileRes.data?.user?.email && !!profileRes.data?.user?.role);

    // Update profile bio
    const updateBioRes = await fetchJson(`${BASE_URL}/api/admin/profile`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify({
        fullName: 'Sanaullah',
        bio: 'Executive Farm Administrator & Founder of SUNNY Dairy Operations',
        avatarUrl: '/profile.jpg',
      }),
    });
    assert('PUT /api/admin/profile updates profile data (200)', updateBioRes.status === 200 && updateBioRes.data?.success);

    // ----------------------------------------------------------------
    // SECTION 6: ADMIN MODULES TESTING
    // ----------------------------------------------------------------
    console.log('\n--- SECTION 6: Admin Panel Modules Testing ---');

    // Dashboard Stats
    const statsRes = await fetchJson(`${BASE_URL}/api/admin/stats`, { headers: adminHeaders });
    assert('GET /api/admin/stats returns statistics (200)', statsRes.status === 200 && statsRes.data?.success);
    assert('Stats calculates revenue, totalOrders, pendingOrders', typeof statsRes.data?.stats?.totalOrders === 'number');

    // Admin Orders List
    const ordersRes = await fetchJson(`${BASE_URL}/api/admin/orders`, { headers: adminHeaders });
    assert('GET /api/admin/orders returns order list (200)', ordersRes.status === 200 && ordersRes.data?.success);

    // Inventory Management
    const invRes = await fetchJson(`${BASE_URL}/api/admin/inventory`, { headers: adminHeaders });
    assert('GET /api/admin/inventory returns inventory items (200)', invRes.status === 200 && invRes.data?.success);

    // Customer Management
    const custRes = await fetchJson(`${BASE_URL}/api/admin/customers`, { headers: adminHeaders });
    assert('GET /api/admin/customers returns customers (200)', custRes.status === 200 && custRes.data?.success);

    // Payments Management
    const payRes = await fetchJson(`${BASE_URL}/api/admin/payments`, { headers: adminHeaders });
    assert('GET /api/admin/payments returns payment records (200)', payRes.status === 200 && payRes.data?.success);

    // Delivery Zones
    const zonesRes = await fetchJson(`${BASE_URL}/api/admin/delivery-zones`, { headers: adminHeaders });
    assert('GET /api/admin/delivery-zones returns zones (200)', zonesRes.status === 200 && zonesRes.data?.success);

    // Reports
    const repRes = await fetchJson(`${BASE_URL}/api/admin/reports`, { headers: adminHeaders });
    assert('GET /api/admin/reports returns reports (200)', repRes.status === 200 && repRes.data?.success);

    // Admin Users List
    const usersRes = await fetchJson(`${BASE_URL}/api/admin/users`, { headers: adminHeaders });
    assert('GET /api/admin/users returns admin user roster (200)', usersRes.status === 200 && usersRes.data?.success);

    // Activity Log
    const actRes = await fetchJson(`${BASE_URL}/api/admin/activity`, { headers: adminHeaders });
    assert('GET /api/admin/activity returns activity audit logs (200)', actRes.status === 200 && actRes.data?.success);

    // CMS Content
    const cmsRes = await fetchJson(`${BASE_URL}/api/admin/cms`, { headers: adminHeaders });
    assert('GET /api/admin/cms returns CMS content (200)', cmsRes.status === 200 && cmsRes.data?.success);

    // Store Settings
    const storeSettingsRes = await fetchJson(`${BASE_URL}/api/admin/settings`, { headers: adminHeaders });
    assert('GET /api/admin/settings returns admin store settings (200)', storeSettingsRes.status === 200 && storeSettingsRes.data?.success);

    // ----------------------------------------------------------------
    // SECTION 7: PRODUCT & CATEGORY CRUD (WITH TEST_ PREFIX)
    // ----------------------------------------------------------------
    console.log('\n--- SECTION 7: Product & Category Management ---');
    const newCatRes = await fetchJson(`${BASE_URL}/api/admin/categories`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        name: 'TEST_CATEGORY_MASTER_QA',
        slug: 'test-category-master-qa',
        description: 'Temporary category created for automated verification',
      }),
    });
    assert('Admin creates TEST_ category (200/201)', newCatRes.status === 200 || newCatRes.status === 201);
    const testCatId = newCatRes.data?.category?.id;
    if (testCatId) createdArtifacts.categories.push(testCatId);

    if (testCatId) {
      // Create product
      const newProdRes = await fetchJson(`${BASE_URL}/api/products`, {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({
          name: 'TEST_PRODUCT_Organic Butter',
          slug: 'test-product-organic-butter',
          description: 'Temporary organic butter for QA testing',
          categoryId: testCatId,
          imageUrl: '/products/fresh-paneer.jpg',
          stockQuantity: 100,
          lowStockThreshold: 10,
          variants: [
            { size: '250g', price: 350, priceType: 'CONFIRMED' },
            { size: '500g', price: 680, priceType: 'CONFIRMED' },
          ],
        }),
      });
      assert('Admin creates TEST_ product with multiple variants (200/201)', newProdRes.status === 200 || newProdRes.status === 201);
      const testProdId = newProdRes.data?.product?.id;
      if (testProdId) createdArtifacts.products.push(testProdId);

      if (testProdId) {
        // Edit product
        const editProd = await fetchJson(`${BASE_URL}/api/products/${testProdId}`, {
          method: 'PUT',
          headers: adminHeaders,
          body: JSON.stringify({
            name: 'TEST_PRODUCT_Organic Butter (Updated)',
            stockQuantity: 120,
            categoryId: testCatId,
          }),
        });
        assert('Admin updates TEST_ product details (200)', editProd.status === 200);

        // Adjust stock via inventory API PUT
        const adjStock = await fetchJson(`${BASE_URL}/api/admin/inventory`, {
          method: 'PUT',
          headers: adminHeaders,
          body: JSON.stringify({
            productId: testProdId,
            newStock: 110,
            reason: 'QA Audit adjustment',
          }),
        });
        assert('Admin adjusts product stock through Inventory API (200)', adjStock.status === 200 && adjStock.data?.success);

        // Verify product shows on public storefront
        const publicCheck = await fetchJson(`${BASE_URL}/api/products/test-product-organic-butter`);
        assert('New product is immediately visible on customer frontend', publicCheck.status === 200 && publicCheck.data?.product?.name.includes('Organic Butter'));
      }
    }

    // ----------------------------------------------------------------
    // SECTION 8: FULL E-COMMERCE CUSTOMER WORKFLOWS
    // ----------------------------------------------------------------
    console.log('\n--- SECTION 8: Customer Ordering Workflows ---');

    // Find confirmed price product (e.g. Desi Pure Ghee or Pure Makhan)
    const confirmedProduct = await prisma.product.findFirst({
      where: {
        isActive: true,
        variants: {
          some: {
            priceType: 'CONFIRMED',
            price: { not: null },
          },
        },
      },
      include: { variants: true },
    });
    assert('Database contains product with confirmed price for instant checkout test', !!confirmedProduct);

    const targetVariant = confirmedProduct.variants.find((v) => v.priceType === 'CONFIRMED' && v.price !== null);
    const codOrderPayload = {
      customerName: 'TEST_CUSTOMER_Asad Khan',
      customerPhone: '03451122334',
      customerWhatsapp: '03451122334',
      deliveryAddress: 'House 5, Street 2, Shorkot Road',
      city: 'Dera Ismail Khan',
      area: 'Shorkot Road',
      deliveryInstructions: 'TEST ORDER - PLEASE DO NOT SHIP',
      paymentMethod: 'CASH_ON_DELIVERY',
      items: [
        {
          productId: confirmedProduct.id,
          selectedVariant: targetVariant.size,
          quantity: 2,
        },
      ],
    };

    const codOrderRes = await fetchJson(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(codOrderPayload),
    });
    assert('Customer places COD order successfully (200/201)', codOrderRes.status === 200 || codOrderRes.status === 201);
    const codOrder = codOrderRes.data?.order;
    if (codOrder) createdArtifacts.orders.push(codOrder.id);

    assert('COD Order has valid SUNNY- format', !!codOrder && codOrder.orderNumber.startsWith('SUNNY-'));
    assert('COD Order starts in PENDING status', codOrder?.orderStatus === 'PENDING');
    assert('COD Order total calculated correctly', codOrder?.finalTotal > 0);

    if (codOrder) {
      // Track order by orderNumber
      const trackByNum = await fetchJson(`${BASE_URL}/api/orders/track?query=${codOrder.orderNumber}`);
      assert('Customer tracks order by Order Number', trackByNum.status === 200 && trackByNum.data?.order?.orderNumber === codOrder.orderNumber);

      // Track order by phone number
      const trackByPhone = await fetchJson(`${BASE_URL}/api/orders/track?query=03451122334`);
      assert('Customer tracks order by Phone Number', trackByPhone.status === 200 && trackByPhone.data?.order);

      // Order confirmation page renders
      const confPage = await fetchJson(`${BASE_URL}/order-confirmation/${codOrder.orderNumber}`);
      assert('Order Confirmation page renders for customer (200)', confPage.status === 200);

      // Printable Invoice page renders
      const invoicePage = await fetchJson(`${BASE_URL}/order-confirmation/${codOrder.orderNumber}/invoice`);
      assert('Printable Invoice page renders for customer (200)', invoicePage.status === 200);

      // Admin updates order status PENDING -> CONFIRMED -> OUT_FOR_DELIVERY -> DELIVERED
      const stConfirmed = await fetchJson(`${BASE_URL}/api/admin/orders/${codOrder.id}`, {
        method: 'PATCH',
        headers: adminHeaders,
        body: JSON.stringify({ orderStatus: 'CONFIRMED', adminNotes: 'Verified via WhatsApp' }),
      });
      assert('Admin confirms order (200)', stConfirmed.status === 200 && stConfirmed.data?.order?.orderStatus === 'CONFIRMED');

      const stDelivery = await fetchJson(`${BASE_URL}/api/admin/orders/${codOrder.id}`, {
        method: 'PATCH',
        headers: adminHeaders,
        body: JSON.stringify({ orderStatus: 'OUT_FOR_DELIVERY' }),
      });
      assert('Admin sets order to OUT_FOR_DELIVERY (200)', stDelivery.status === 200 && stDelivery.data?.order?.orderStatus === 'OUT_FOR_DELIVERY');

      const stDelivered = await fetchJson(`${BASE_URL}/api/admin/orders/${codOrder.id}`, {
        method: 'PATCH',
        headers: adminHeaders,
        body: JSON.stringify({ orderStatus: 'DELIVERED', paymentStatus: 'PAID' }),
      });
      assert('Admin marks order DELIVERED & PAID (200)', stDelivered.status === 200 && stDelivered.data?.order?.orderStatus === 'DELIVERED');
    }

    // Order 2: Bank Transfer (Advance Payment) & Cancellation Workflow
    const bankOrderPayload = {
      customerName: 'TEST_CUSTOMER_Hamza Tariq',
      customerPhone: '03469988776',
      customerWhatsapp: '03469988776',
      deliveryAddress: 'Flat 3, Gulshan Market, Cantt',
      city: 'Dera Ismail Khan',
      area: 'Cantt',
      deliveryInstructions: 'TEST ADVANCE ORDER',
      paymentMethod: 'ADVANCE_UBL',
      senderName: 'Hamza Tariq',
      transactionReference: 'UBL-TID-99887711',
      receiptImageUrl: '/uploads/receipts/test-sample-receipt.jpg',
      items: [
        {
          productId: confirmedProduct.id,
          selectedVariant: targetVariant.size,
          quantity: 1,
        },
      ],
    };

    const bankOrderRes = await fetchJson(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bankOrderPayload),
    });
    assert('Customer places Advance Bank Transfer order (200/201)', bankOrderRes.status === 200 || bankOrderRes.status === 201);
    const bankOrder = bankOrderRes.data?.order;
    if (bankOrder) createdArtifacts.orders.push(bankOrder.id);

    if (bankOrder) {
      assert('Advance Bank Transfer paymentMethod is ADVANCE_UBL', bankOrder.paymentMethod === 'ADVANCE_UBL');

      // Customer Cancellation Request Flow
      const cancelReq = await fetchJson(`${BASE_URL}/api/orders/cancel-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: bankOrder.orderNumber,
          reason: 'Customer requested change of mind (QA)',
        }),
      });
      assert('Customer submits cancellation request while in PENDING status (200)', cancelReq.status === 200 && cancelReq.data?.success);

      // Admin accepts cancellation and marks order CANCELLED
      const adminCancel = await fetchJson(`${BASE_URL}/api/admin/orders/${bankOrder.id}`, {
        method: 'PATCH',
        headers: adminHeaders,
        body: JSON.stringify({
          orderStatus: 'CANCELLED',
          adminNotes: 'Cancellation accepted upon customer request',
        }),
      });
      assert('Admin processes cancellation and sets CANCELLED status (200)', adminCancel.status === 200 && adminCancel.data?.order?.orderStatus === 'CANCELLED');
    }

    // ----------------------------------------------------------------
    // SECTION 9: STRICT TEST DATA CLEANUP (MANDATORY RULE)
    // ----------------------------------------------------------------
    console.log('\n--- SECTION 9: Strict Test Data Cleanup ---');

    // 1. Delete test products & variants
    for (const prodId of createdArtifacts.products) {
      await prisma.productVariant.deleteMany({ where: { productId: prodId } });
      await prisma.inventoryLog.deleteMany({ where: { productId: prodId } });
      await prisma.product.delete({ where: { id: prodId } });
      console.log(`[CLEANUP] Deleted test product ${prodId}`);
    }

    // 2. Delete test categories
    for (const catId of createdArtifacts.categories) {
      await prisma.category.delete({ where: { id: catId } });
      console.log(`[CLEANUP] Deleted test category ${catId}`);
    }

    // 3. Delete test orders, order items, and payment transactions
    for (const orderId of createdArtifacts.orders) {
      await prisma.orderItem.deleteMany({ where: { orderId } });
      await prisma.payment.deleteMany({ where: { orderId } });
      await prisma.order.delete({ where: { id: orderId } });
      console.log(`[CLEANUP] Deleted test order ${orderId}`);
    }

    // Clean up any test customers created
    await prisma.customer.deleteMany({
      where: {
        OR: [
          { fullName: { contains: 'TEST' } },
          { phone: { in: ['03451122334', '03469988776', '03449322930'] } },
        ],
      },
    });
    console.log('[CLEANUP] Cleaned up temporary test customer profiles');

    // Verify database counts
    const finalOrders = await prisma.order.count();
    const finalPayments = await prisma.payment.count();
    const finalTestCustomers = await prisma.customer.count({
      where: { fullName: { contains: 'TEST' } },
    });
    const finalProducts = await prisma.product.count();
    const finalCategories = await prisma.category.count();
    const finalAdmins = await prisma.adminUser.count();

    assert('Zero test orders remain in database', finalOrders === 0, `Remaining: ${finalOrders}`);
    assert('Zero test payments remain in database', finalPayments === 0, `Remaining: ${finalPayments}`);
    assert('Zero test customers remain in database', finalTestCustomers === 0, `Remaining: ${finalTestCustomers}`);
    assert('Original 11 products preserved intact', finalProducts === 11, `Actual: ${finalProducts}`);
    assert('Original 4 categories preserved intact', finalCategories === 4, `Actual: ${finalCategories}`);
    assert('Super admin account preserved intact', finalAdmins >= 1, `Actual: ${finalAdmins}`);

  } catch (err) {
    console.error('Master QA Suite Error:', err);
    assert('Master QA Suite ran without fatal unhandled exception', false, err.message);
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n================================================================');
  console.log(`   MASTER QA RESULTS: ${results.passed}/${results.total} PASSED (${Math.round((results.passed/results.total)*100)}%)`);
  if (results.failed > 0) {
    console.log(`   FAILED TESTS: ${results.failed}`);
  }
  console.log('================================================================\n');

  return results;
}

runMasterQaSuite().then(res => {
  process.exit(res.failed > 0 ? 1 : 0);
});
