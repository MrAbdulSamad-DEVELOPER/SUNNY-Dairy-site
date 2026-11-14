const http = require('http');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000';

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  let data = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try { data = await res.json(); } catch (e) {}
  } else {
    data = await res.text();
  }
  return { status: res.status, headers: res.headers, data };
}

async function runQaSuite() {
  console.log('====================================================');
  console.log('   SUNNY DAIRY E-COMMERCE END-TO-END QA SUITE');
  console.log('====================================================\n');

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

  try {
    // ----------------------------------------------------
    // MODULE 1: PUBLIC CUSTOMER PAGES
    // ----------------------------------------------------
    console.log('\n--- MODULE 1: Customer Storefront Pages ---');
    const publicPages = [
      '/',
      '/shop',
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
      assert(`Customer page renders: ${page}`, res.status === 200, `HTTP status ${res.status}`);
    }

    // ----------------------------------------------------
    // MODULE 2: PUBLIC CATALOG & STORE APIs
    // ----------------------------------------------------
    console.log('\n--- MODULE 2: Public Store & Catalog APIs ---');
    const prodRes = await fetchJson(`${BASE_URL}/api/products`);
    assert('GET /api/products returns 200', prodRes.status === 200);
    assert('GET /api/products returns array of products', Array.isArray(prodRes.data.products) && prodRes.data.products.length > 0, `Count: ${prodRes.data.products?.length}`);

    const sampleProduct = prodRes.data.products[0];
    const singleProdRes = await fetchJson(`${BASE_URL}/api/products/${sampleProduct.slug || sampleProduct.id}`);
    assert('GET /api/products/[id/slug] returns 200 and product details', singleProdRes.status === 200 && singleProdRes.data.product?.id, `Product: ${singleProdRes.data.product?.name}`);

    const catRes = await fetchJson(`${BASE_URL}/api/categories`);
    assert('GET /api/categories returns 200', catRes.status === 200);
    assert('Categories list populated', Array.isArray(catRes.data.categories) && catRes.data.categories.length > 0);

    const settingsRes = await fetchJson(`${BASE_URL}/api/settings`);
    assert('GET /api/settings returns 200', settingsRes.status === 200);
    assert('Settings contains store_name', !!settingsRes.data.settings?.store_name);

    // ----------------------------------------------------
    // MODULE 3: SECURITY & UNAUTHENTICATED ACCESS PROTECTION
    // ----------------------------------------------------
    console.log('\n--- MODULE 3: Security & Route Protection (Zero-Trust) ---');
    const protectedAdminEndpoints = [
      { url: '/api/admin/orders', method: 'GET' },
      { url: '/api/admin/stats', method: 'GET' },
      { url: '/api/products', method: 'POST' },
      { url: '/api/admin/categories', method: 'POST' },
      { url: '/api/admin/inventory', method: 'GET' },
      { url: '/api/admin/customers', method: 'GET' },
      { url: '/api/admin/payments', method: 'GET' },
      { url: '/api/admin/reports', method: 'GET' },
      { url: '/api/admin/settings', method: 'GET' },
      { url: '/api/admin/users', method: 'GET' },
    ];

    for (const ep of protectedAdminEndpoints) {
      const res = await fetchJson(`${BASE_URL}${ep.url}`, { method: ep.method });
      assert(
        `Unauthenticated ${ep.method} ${ep.url} blocked (401)`,
        res.status === 401,
        `Got HTTP ${res.status}`
      );
    }

    // ----------------------------------------------------
    // MODULE 4: ADMIN AUTHENTICATION & LOGIN
    // ----------------------------------------------------
    console.log('\n--- MODULE 4: Admin Authentication ---');
    // Test invalid password
    const badLogin = await fetchJson(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'WrongPassword999!' }),
    });
    assert('Invalid admin credentials rejected (401)', badLogin.status === 401);

    // Test valid super admin login
    const goodLogin = await fetchJson(`${BASE_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'SunnyDairyAdmin2026!' }),
    });
    assert('Valid admin login succeeds (200)', goodLogin.status === 200 && goodLogin.data.success);

    // Extract auth cookie
    const rawCookies = goodLogin.headers.get('set-cookie') || '';
    const sessionMatch = rawCookies.match(/sunny_admin_session=([^;]+)/);
    const sessionCookie = sessionMatch ? `sunny_admin_session=${sessionMatch[1]}` : '';
    assert('Session cookie sunny_admin_session issued', !!sessionCookie);

    const adminHeaders = {
      'Content-Type': 'application/json',
      Cookie: sessionCookie,
    };

    // ----------------------------------------------------
    // MODULE 5: AUTHENTICATED ADMIN OPERATIONS
    // ----------------------------------------------------
    console.log('\n--- MODULE 5: Authenticated Admin Operations ---');
    const adminStats = await fetchJson(`${BASE_URL}/api/admin/stats`, { headers: adminHeaders });
    assert('GET /api/admin/stats authorized (200)', adminStats.status === 200 && adminStats.data.success);

    const adminOrders = await fetchJson(`${BASE_URL}/api/admin/orders`, { headers: adminHeaders });
    assert('GET /api/admin/orders authorized (200)', adminOrders.status === 200 && adminOrders.data.success);

    const adminInv = await fetchJson(`${BASE_URL}/api/admin/inventory`, { headers: adminHeaders });
    assert('GET /api/admin/inventory authorized (200)', adminInv.status === 200 && adminInv.data.success);

    const adminReports = await fetchJson(`${BASE_URL}/api/admin/reports`, { headers: adminHeaders });
    assert('GET /api/admin/reports authorized (200)', adminReports.status === 200 && adminReports.data.success);

    const adminUsers = await fetchJson(`${BASE_URL}/api/admin/users`, { headers: adminHeaders });
    assert('GET /api/admin/users authorized (200)', adminUsers.status === 200 && adminUsers.data.success);

    // Test Admin Category CRUD
    console.log('\n--- Admin Category & Product CRUD ---');
    const createCatRes = await fetchJson(`${BASE_URL}/api/admin/categories`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        name: 'TEST_CATEGORY_QA',
        slug: 'test-category-qa',
        description: 'Temporary QA Category',
      }),
    });
    assert('Admin creates temporary category (200/201)', createCatRes.status === 200 || createCatRes.status === 201);
    const createdCatId = createCatRes.data?.category?.id;

    if (createdCatId) {
      // Test Admin Product Creation
      const createProdRes = await fetchJson(`${BASE_URL}/api/products`, {
        method: 'POST',
        headers: adminHeaders,
        body: JSON.stringify({
          name: 'TEST_PRODUCT_QA Fresh Cheese',
          slug: 'test-product-qa-cheese',
          description: 'Temporary QA Product',
          categoryId: createdCatId,
          imageUrl: '/products/fresh-paneer.jpg',
          stockQuantity: 50,
          lowStockThreshold: 5,
          variants: [{ size: '500g', price: 450, priceType: 'CONFIRMED' }],
        }),
      });
      assert('Admin creates temporary product (200/201)', createProdRes.status === 200 || createProdRes.status === 201);
      const createdProdId = createProdRes.data?.product?.id;

      if (createdProdId) {
        // Edit product (PUT /api/products/[id])
        const editProdRes = await fetchJson(`${BASE_URL}/api/products/${createdProdId}`, {
          method: 'PUT',
          headers: adminHeaders,
          body: JSON.stringify({
            name: 'TEST_PRODUCT_QA Fresh Cheese Updated',
            stockQuantity: 75,
            categoryId: createdCatId,
          }),
        });
        assert('Admin updates product (200)', editProdRes.status === 200);

        // Delete product
        const delProdRes = await fetchJson(`${BASE_URL}/api/products/${createdProdId}`, {
          method: 'DELETE',
          headers: adminHeaders,
        });
        assert('Admin deletes temporary product (200)', delProdRes.status === 200);
      }

      // Delete Category
      const delCatRes = await fetchJson(`${BASE_URL}/api/admin/categories?id=${createdCatId}`, {
        method: 'DELETE',
        headers: adminHeaders,
      });
      assert('Admin deletes temporary category (200)', delCatRes.status === 200);
    }

    // ----------------------------------------------------
    // MODULE 6: END-TO-END ORDERING & WORKFLOW
    // ----------------------------------------------------
    console.log('\n--- MODULE 6: End-to-End Customer Order Flow ---');
    // Ensure product variant exists for order
    const firstProduct = await prisma.product.findFirst({
      where: { isActive: true },
      include: { variants: true },
    });
    assert('Active product with variant exists in DB', !!firstProduct && firstProduct.variants.length > 0);

    const variant = firstProduct.variants[0];
    const orderPayload = {
      customerName: 'TEST_CUSTOMER_QA Sanaullah Test',
      customerPhone: '03449322930',
      customerWhatsapp: '03449322930',
      deliveryAddress: 'House 12, Street 4, Officers Colony, Cantt',
      city: 'Dera Ismail Khan',
      area: 'Officers Colony Cantt',
      deliveryInstructions: 'TEST ORDER FOR QA AUTOMATION',
      paymentMethod: 'CASH_ON_DELIVERY',
      items: [
        {
          productId: firstProduct.id,
          selectedVariant: variant.size,
          quantity: 2,
        },
      ],
    };

    const createOrderRes = await fetchJson(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });

    assert('Customer order placement succeeds (200/201)', createOrderRes.status === 200 || createOrderRes.status === 201, `Status: ${createOrderRes.status}`);
    const createdOrder = createOrderRes.data.order;
    assert('Order Number generated with brand prefix SUNNY-', createdOrder && createdOrder.orderNumber.startsWith('SUNNY-'), `Order: ${createdOrder?.orderNumber}`);

    if (createdOrder) {
      // Test Order Tracking API
      const trackRes = await fetchJson(`${BASE_URL}/api/orders/track?query=${createdOrder.orderNumber}`);
      assert('Order tracking by Order Number succeeds (200)', trackRes.status === 200 && trackRes.data.order?.orderNumber === createdOrder.orderNumber);

      const trackPhoneRes = await fetchJson(`${BASE_URL}/api/orders/track?query=03449322930`);
      assert('Order tracking by Customer Phone succeeds (200)', trackPhoneRes.status === 200 && trackPhoneRes.data.order);

      // Test Order Confirmation and Invoice pages
      const confPage = await fetchJson(`${BASE_URL}/order-confirmation/${createdOrder.orderNumber}`);
      assert('Order confirmation page renders (200)', confPage.status === 200);

      const invoicePage = await fetchJson(`${BASE_URL}/order-confirmation/${createdOrder.orderNumber}/invoice`);
      assert('Printable invoice page renders (200)', invoicePage.status === 200);

      // Test Customer Cancellation Request (when in PENDING state)
      const cancelReqRes = await fetchJson(`${BASE_URL}/api/orders/cancel-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: createdOrder.orderNumber,
          reason: 'QA Test Cancellation Flow',
        }),
      });
      assert('Customer cancel request submitted (200)', cancelReqRes.status === 200 && cancelReqRes.data.success);

      // Test Admin Order Management Status Transitions
      console.log('\n--- Admin Processing Test Order ---');
      const updateStatusRes = await fetchJson(`${BASE_URL}/api/admin/orders/${createdOrder.id}`, {
        method: 'PATCH',
        headers: adminHeaders,
        body: JSON.stringify({
          orderStatus: 'CONFIRMED',
          adminNotes: 'QA Status Confirmed by Sanaullah',
        }),
      });
      assert('Admin updates order status to CONFIRMED (200)', updateStatusRes.status === 200 && updateStatusRes.data.order?.orderStatus === 'CONFIRMED');

      const updateDeliveredRes = await fetchJson(`${BASE_URL}/api/admin/orders/${createdOrder.id}`, {
        method: 'PATCH',
        headers: adminHeaders,
        body: JSON.stringify({
          orderStatus: 'DELIVERED',
        }),
      });
      assert('Admin updates order status to DELIVERED (200)', updateDeliveredRes.status === 200 && updateDeliveredRes.data.order?.orderStatus === 'DELIVERED');
    }

    // ----------------------------------------------------
    // MODULE 7: FORGOT PASSWORD DYNAMIC VALIDATION
    // ----------------------------------------------------
    console.log('\n--- MODULE 7: Dynamic Forgot Password Security ---');
    const randomPw = await fetchJson(`${BASE_URL}/api/admin/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: 'random_nonexistent_email@test.com' }),
    });
    assert('Unregistered email correctly rejected (404)', randomPw.status === 404);

    const validPw = await fetchJson(`${BASE_URL}/api/admin/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity: 'sanaullah.ccs@gmail.com' }),
    });
    assert('Registered admin email accepted (200)', validPw.status === 200 && validPw.data.success);

    // ----------------------------------------------------
    // MODULE 8: TEST DATA CLEANUP (MANDATORY RULE)
    // ----------------------------------------------------
    console.log('\n--- MODULE 8: Strict Test Data Cleanup ---');
    if (createdOrder) {
      await prisma.orderItem.deleteMany({ where: { orderId: createdOrder.id } });
      await prisma.payment.deleteMany({ where: { orderId: createdOrder.id } });
      await prisma.order.delete({ where: { id: createdOrder.id } });
      console.log(`[CLEANUP] Deleted temporary test order: ${createdOrder.orderNumber}`);
    }

    // Delete any remaining TEST_ orders or customers
    const lingeringOrders = await prisma.order.findMany({
      where: {
        OR: [
          { orderNumber: { contains: 'TEST' } },
          { customerName: { contains: 'TEST' } },
        ],
      },
    });
    for (const ord of lingeringOrders) {
      await prisma.orderItem.deleteMany({ where: { orderId: ord.id } });
      await prisma.payment.deleteMany({ where: { orderId: ord.id } });
      await prisma.order.delete({ where: { id: ord.id } });
      console.log(`[CLEANUP] Deleted lingering test order: ${ord.orderNumber}`);
    }

    const finalOrderCount = await prisma.order.count();
    const finalPaymentCount = await prisma.payment.count();
    assert('Database order count is 0 test orders', finalOrderCount === 0, `Final orders: ${finalOrderCount}`);
    assert('Database payment count is 0 test payments', finalPaymentCount === 0, `Final payments: ${finalPaymentCount}`);

  } catch (err) {
    console.error('QA Suite Execution Error:', err);
    assert('QA Suite completed without unhandled fatal crash', false, err.message);
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n====================================================');
  console.log(`   QA SUITE RESULTS: ${results.passed}/${results.total} PASSED (${Math.round((results.passed/results.total)*100)}%)`);
  if (results.failed > 0) {
    console.log(`   FAILED TESTS: ${results.failed}`);
  }
  console.log('====================================================\n');
  return results;
}

runQaSuite().then(res => {
  process.exit(res.failed > 0 ? 1 : 0);
});
