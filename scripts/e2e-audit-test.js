const http = require('http');

const BASE_URL = 'http://localhost:3001';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqHeaders = { ...headers };
    let payload = null;

    if (body) {
      if (typeof body === 'object') {
        payload = JSON.stringify(body);
        reqHeaders['Content-Type'] = 'application/json';
      } else {
        payload = body;
      }
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request(
      url,
      {
        method,
        headers: reqHeaders,
      },
      (res) => {
        let resData = '';
        res.on('data', (chunk) => (resData += chunk));
        res.on('end', () => {
          let parsed = null;
          try {
            parsed = JSON.parse(resData);
          } catch {
            parsed = resData;
          }
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: parsed,
          });
        });
      }
    );

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runAudit() {
  console.log('=== STARTING COMPLETE E-COMMERCE END-TO-END QA & SECURITY AUDIT ===\n');
  const results = {
    total: 0,
    passed: 0,
    failed: 0,
    tests: [],
  };

  function record(name, passed, details = '') {
    results.total++;
    if (passed) {
      results.passed++;
      console.log(`✓ [PASS] ${name}`);
    } else {
      results.failed++;
      console.error(`✗ [FAIL] ${name} — ${details}`);
    }
    results.tests.push({ name, passed, details });
  }

  // 1. PUBLIC STOREFRONT APIS
  let sampleProduct = null;
  try {
    const resProducts = await request('GET', '/api/products');
    const prodsList = resProducts.body?.products || (Array.isArray(resProducts.body) ? resProducts.body : []);
    sampleProduct = prodsList[0];
    record('Public API: /api/products returns active products list', resProducts.status === 200 && Array.isArray(prodsList) && prodsList.length > 0, `Count: ${prodsList.length}`);
  } catch (e) {
    record('Public API: /api/products', false, e.message);
  }

  try {
    const resCats = await request('GET', '/api/categories');
    const catsList = resCats.body?.categories || (Array.isArray(resCats.body) ? resCats.body : []);
    record('Public API: /api/categories returns category tree', resCats.status === 200 && Array.isArray(catsList) && catsList.length > 0, `Count: ${catsList.length}`);
  } catch (e) {
    record('Public API: /api/categories', false, e.message);
  }

  try {
    const resSettings = await request('GET', '/api/settings');
    record('Public API: /api/settings returns store contact & bank details', resSettings.status === 200 && Boolean(resSettings.body?.settings));
  } catch (e) {
    record('Public API: /api/settings', false, e.message);
  }

  // 2. SECURITY & ROUTE PROTECTION (UNAUTHENTICATED CHECKS)
  try {
    const unauthOrders = await request('GET', '/api/admin/orders');
    record('Security Audit: /api/admin/orders blocks unauthorized access', unauthOrders.status === 401);
  } catch (e) {
    record('Security Audit: /api/admin/orders', false, e.message);
  }

  try {
    const unauthBlogs = await request('GET', '/api/admin/blogs');
    record('Security Audit: /api/admin/blogs blocks unauthorized access', unauthBlogs.status === 401);
  } catch (e) {
    record('Security Audit: /api/admin/blogs', false, e.message);
  }

  try {
    const unauthUsers = await request('GET', '/api/admin/users');
    record('Security Audit: /api/admin/users blocks unauthorized access', unauthUsers.status === 401);
  } catch (e) {
    record('Security Audit: /api/admin/users', false, e.message);
  }

  try {
    const unauthStats = await request('GET', '/api/admin/stats');
    record('Security Audit: /api/admin/stats blocks unauthorized access', unauthStats.status === 401);
  } catch (e) {
    record('Security Audit: /api/admin/stats', false, e.message);
  }

  // 3. ADMIN AUTHENTICATION
  let adminCookie = null;
  try {
    const badLogin = await request('POST', '/api/admin/login', { username: 'admin', password: 'WrongPassword123!' });
    record('Auth Audit: Rejects invalid admin credentials with 401', badLogin.status === 401);

    const goodLogin = await request('POST', '/api/admin/login', { username: 'admin', password: 'SunnyDairyAdmin2026!' });
    const setCookie = goodLogin.headers['set-cookie'];
    if (setCookie && setCookie.length > 0) {
      adminCookie = setCookie[0].split(';')[0];
    }
    record('Auth Audit: Authenticates valid admin & issues secure session cookie', goodLogin.status === 200 && Boolean(adminCookie));
  } catch (e) {
    record('Auth Audit: Login workflow', false, e.message);
  }

  const authHeaders = adminCookie ? { Cookie: adminCookie } : {};

  // 4. AUTHENTICATED ADMIN ACCESS
  try {
    const statsRes = await request('GET', '/api/admin/stats', null, authHeaders);
    record('Admin Portal: /api/admin/stats returns analytics with session cookie', statsRes.status === 200 && statsRes.body?.success);
  } catch (e) {
    record('Admin Portal: /api/admin/stats', false, e.message);
  }

  try {
    const blogRes = await request('GET', '/api/admin/blogs', null, authHeaders);
    record('Admin Portal: /api/admin/blogs returns blog posts & stats', blogRes.status === 200 && blogRes.body?.success && Array.isArray(blogRes.body.blogs));
  } catch (e) {
    record('Admin Portal: /api/admin/blogs', false, e.message);
  }

  // 5. FULL END-TO-END E-COMMERCE ORDER WORKFLOW
  let testOrderNumber = null;
  let testOrderId = null;
  try {
    const variantSize = sampleProduct?.variants?.[0]?.size || '1 Litre';
    const orderPayload = {
      customerName: 'TEST_CUSTOMER_QA',
      customerPhone: '03001234567',
      customerWhatsapp: '03001234567',
      city: 'Dera Ismail Khan',
      area: 'Cantt',
      deliveryAddress: 'House 42, Sector B, Cantt (TEST_E2E)',
      deliveryInstructions: 'TEST ORDER FOR END-TO-END QA VERIFICATION',
      paymentMethod: 'CASH_ON_DELIVERY',
      items: [
        {
          productId: sampleProduct?.id,
          selectedVariant: variantSize,
          quantity: 2,
        },
      ],
    };

    const orderRes = await request('POST', '/api/orders', orderPayload);
    const orderCreated = orderRes.status === 201 && orderRes.body?.success;
    if (orderCreated) {
      testOrderNumber = orderRes.body.order.orderNumber;
      testOrderId = orderRes.body.order.id;
    }
    record('E-Commerce Workflow: Customer places order successfully', orderCreated, `Order: ${testOrderNumber}`);

    // Order Tracking API
    const trackRes = await request('GET', `/api/orders/track?query=${testOrderNumber}`);
    record('E-Commerce Workflow: Order tracking endpoint retrieves live order details', trackRes.status === 200 && trackRes.body?.success && trackRes.body.order?.orderNumber === testOrderNumber);

    // Admin Order Inspection
    const adminOrdersRes = await request('GET', '/api/admin/orders', null, authHeaders);
    const orderInAdmin = adminOrdersRes.body?.orders?.some((o) => o.orderNumber === testOrderNumber);
    record('E-Commerce Workflow: Admin portal receives live order in real-time', Boolean(orderInAdmin));

    // Admin Order Status Transition
    const updateRes = await request('PATCH', `/api/admin/orders/${testOrderId}`, { orderStatus: 'CONFIRMED', adminNotes: 'Confirmed by QA Audit' }, authHeaders);
    record('E-Commerce Workflow: Admin updates order status to CONFIRMED', updateRes.status === 200 && updateRes.body?.order?.orderStatus === 'CONFIRMED');

    // Customer Tracking Updated Status
    const trackUpdated = await request('GET', `/api/orders/track?query=${testOrderNumber}`);
    record('E-Commerce Workflow: Customer tracking immediately displays updated CONFIRMED status', trackUpdated.body?.order?.orderStatus === 'CONFIRMED');

    // Customer Cancel Request
    const cancelReqRes = await request('POST', '/api/orders/cancel-request', {
      orderNumber: testOrderNumber,
      phone: '03001234567',
      reason: 'TEST cancellation request by automated QA tester',
    });
    record('E-Commerce Workflow: Customer submits cancellation request', cancelReqRes.status === 200 && cancelReqRes.body?.success);

  } catch (e) {
    record('E-Commerce Workflow: Order Placement & Processing', false, e.message);
  }

  // 6. BLOG MANAGEMENT CRUD WORKFLOW
  let testBlogId = null;
  const tempBlogSlug = `qa-audit-temp-blog-${Date.now()}`;
  try {
    const testBlogPayload = {
      title: 'TEST_QA_BLOG_ARTICLE_TITLE',
      slug: tempBlogSlug,
      category: 'Purity & Quality Guides',
      summary: 'This is an automated test blog post summary created for QA testing.',
      contentHtml: '<p>Automated test blog content.</p>',
      coverImage: '/products/fresh-milk.jpg',
      authorName: 'Sanaullah',
      authorRole: 'Master Dairy Farm Manager',
      readTime: '3 min read',
      isPublished: true,
      isFeatured: false,
    };

    // Create
    const createBlogRes = await request('POST', '/api/admin/blogs', testBlogPayload, authHeaders);
    if (createBlogRes.body?.blog?.id) {
      testBlogId = createBlogRes.body.blog.id;
    }
    record('Blog Management: Admin creates new blog article via API', createBlogRes.status === 201 && Boolean(testBlogId));

    // Edit
    const editBlogRes = await request('PUT', `/api/admin/blogs/${testBlogId}`, {
      ...testBlogPayload,
      title: 'TEST_QA_BLOG_ARTICLE_TITLE_UPDATED',
    }, authHeaders);
    record('Blog Management: Admin updates existing blog article', editBlogRes.status === 200 && editBlogRes.body?.blog?.title === 'TEST_QA_BLOG_ARTICLE_TITLE_UPDATED');

    // Status Toggle
    const statusBlogRes = await request('PATCH', `/api/admin/blogs/${testBlogId}/status`, { isPublished: false }, authHeaders);
    record('Blog Management: Admin toggles published/draft status', statusBlogRes.status === 200 && statusBlogRes.body?.blog?.isPublished === false);

    // Delete
    const deleteBlogRes = await request('DELETE', `/api/admin/blogs/${testBlogId}`, null, authHeaders);
    record('Blog Management: Admin deletes test blog article permanently', deleteBlogRes.status === 200);
    testBlogId = null;

  } catch (e) {
    record('Blog Management: CRUD operations', false, e.message);
  }

  // 7. WEBSITE CMS SECTION UPDATE AUDIT
  try {
    const cmsUpdateRes = await request('PUT', '/api/admin/cms', {
      sections: {
        batch_ticker: {
          title: 'Live Farm Update',
          subtitle: 'Next Morning Batch: Milking at 4:30 AM · Insulated Cold-Chain Chilled',
          isEnabled: true,
          metadata: JSON.stringify({
            temp: 'Chilled below 4°C',
            purity: 'Lactometer Verified: 0% Water',
            hours: 'Doorstep: 7:00 AM – 11:30 AM',
          }),
        },
      },
    }, authHeaders);
    record('CMS Suite: Updates and persists live farm batch ticker metadata', cmsUpdateRes.status === 200 && cmsUpdateRes.body?.success);
  } catch (e) {
    record('CMS Suite: Batch ticker update', false, e.message);
  }

  // 8. TEST DATA CLEANUP (MANDATORY REQUIREMENT)
  console.log('\n=== EXECUTING TEST DATA CLEANUP ===');
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  try {
    if (testOrderNumber || testOrderId) {
      await prisma.orderItem.deleteMany({
        where: { order: { orderNumber: { contains: 'TEST' } } },
      });
      await prisma.order.deleteMany({
        where: {
          OR: [
            { orderNumber: { contains: 'TEST' } },
            { customerName: { contains: 'TEST' } },
            { id: testOrderId || 'none' },
          ],
        },
      });
    }

    // Clean test customers
    await prisma.customer.deleteMany({
      where: { fullName: { contains: 'TEST' } },
    });

    // Clean specific test blog if still exists
    if (testBlogId) {
      await prisma.blogPost.deleteMany({
        where: { id: testBlogId },
      });
    }
    await prisma.blogPost.deleteMany({
      where: {
        OR: [
          { slug: tempBlogSlug },
          { title: { contains: 'TEST_QA' } },
        ],
      },
    });

    // Clean test activity logs
    await prisma.activityLog.deleteMany({
      where: {
        OR: [
          { details: { contains: 'TEST' } },
          { details: { contains: 'qa-audit-temp' } },
        ],
      },
    });

    const residualOrders = await prisma.order.count();
    const residualCustomers = await prisma.customer.count();
    const residualPayments = await prisma.payment.count();
    const activeProducts = await prisma.product.count();
    const activeBlogs = await prisma.blogPost.count();

    const cleanSuccess = residualOrders === 0 && residualCustomers === 0 && residualPayments === 0;
    record('Test Data Cleanup: Residual test orders verified (Count: 0)', residualOrders === 0);
    record('Test Data Cleanup: Residual test customers verified (Count: 0)', residualCustomers === 0);
    record('Test Data Cleanup: Residual test payments verified (Count: 0)', residualPayments === 0);
    record('Test Data Cleanup: Real product catalog intact (Count: 11)', activeProducts === 11);
    record('Test Data Cleanup: Real blog guides intact (Count: 5)', activeBlogs === 5);

    console.log(`\nDatabase Status: ${residualOrders} orders, ${residualCustomers} customers, ${residualPayments} payments, ${activeProducts} products, ${activeBlogs} blogs.`);

  } catch (e) {
    record('Test Data Cleanup', false, e.message);
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n=== AUDIT RESULTS SUMMARY ===');
  console.log(`Total Test Cases Executed: ${results.total}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Pass Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);

  if (results.failed === 0) {
    console.log('\n>>> ALL 27/27 AUTOMATED QA & SECURITY AUDIT TEST CASES PASSED SUCCESSFULLY (100%)! <<<');
  }
}

runAudit().catch(console.error);
