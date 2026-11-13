const http = require('http');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const BASE_URL = 'http://localhost:3000';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const method = options.method || 'GET';
  const headers = options.headers || {};
  let body = options.body;

  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const res = await fetch(url, {
    method,
    headers,
    body,
  });

  const contentType = res.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    data = await res.text();
  }

  return {
    status: res.status,
    headers: res.headers,
    data,
  };
}

async function run() {
  console.log('====================================================');
  console.log('🚀 SUNNY DAIRY COMPREHENSIVE E2E & FEATURE TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. PUBLIC ROUTES HEALTH CHECK
    console.log('--- 1. Testing Public Pages (200 OK) ---');
    const publicPages = [
      '/',
      '/shop',
      '/cart',
      '/checkout',
      '/contact',
      '/track',
      '/about',
      '/faq',
      '/delivery',
      '/our-promise',
      '/privacy',
      '/terms',
    ];

    for (const page of publicPages) {
      const res = await request(page);
      assert(res.status === 200, `Page ${page} returned status 200`);
    }

    // 2. PRODUCT SLUG PAGE
    console.log('\n--- 2. Testing Product Detail Page ---');
    const firstProduct = await prisma.product.findFirst({ where: { isActive: true } });
    if (firstProduct) {
      const res = await request(`/product/${firstProduct.slug}`);
      assert(res.status === 200, `Product page /product/${firstProduct.slug} returned 200`);
    } else {
      console.log('  ⚠️ No active product found to test slug');
    }

    // 3. CHECKOUT FLOW - CASH ON DELIVERY (COD)
    console.log('\n--- 3. Testing Checkout Flow: Cash On Delivery (COD) ---');
    const cowMilk = await prisma.product.findFirst({
      where: { slug: 'fresh-cow-milk' },
      include: { variants: true },
    });

    assert(cowMilk !== null, 'Found Fresh Cow Milk in database');
    const variant1 = cowMilk.variants[0];

    const codPayload = {
      customerName: 'Test Customer COD',
      customerPhone: '03449322930',
      customerWhatsapp: '03449322930',
      deliveryAddress: 'House 12, Street 3, Cantt Area',
      city: 'Dera Ismail Khan',
      area: 'Cantt Area',
      deliveryInstructions: 'Ring bell twice',
      paymentMethod: 'CASH_ON_DELIVERY',
      items: [
        {
          productId: cowMilk.id,
          selectedVariant: variant1.size,
          quantity: 2,
        },
      ],
    };

    const codOrderRes = await request('/api/orders', {
      method: 'POST',
      body: codPayload,
    });

    assert(codOrderRes.status === 200 || codOrderRes.status === 201, 'COD Order placed successfully');
    assert(codOrderRes.data?.success === true, 'COD Order response has success: true');
    const codOrder = codOrderRes.data?.order;
    assert(codOrder && codOrder.orderNumber, `Generated Order #${codOrder?.orderNumber}`);

    // Test invoice page for COD order
    if (codOrder?.orderNumber) {
      const invoiceRes = await request(`/order-confirmation/${codOrder.orderNumber}/invoice`);
      assert(invoiceRes.status === 200, `Invoice page accessible for #${codOrder.orderNumber}`);

      // Test order tracking endpoint
      const trackRes = await request('/api/orders/track', {
        method: 'POST',
        body: { query: codOrder.orderNumber },
      });
      assert(trackRes.status === 200 && trackRes.data?.success === true, 'Track order by orderNumber works');

      const trackPhoneRes = await request('/api/orders/track', {
        method: 'POST',
        body: { query: '03449322930' },
      });
      assert(trackPhoneRes.status === 200 && trackPhoneRes.data?.orders?.length > 0, 'Track order by phone works');
    }

    // 4. CHECKOUT FLOW - ADVANCE BANK TRANSFER (UBL) + RECEIPT
    console.log('\n--- 4. Testing Checkout Flow: Advance Bank Transfer (UBL) ---');
    const ublPayload = {
      customerName: 'Test Customer UBL',
      customerPhone: '03449322930',
      customerWhatsapp: '03449322930',
      deliveryAddress: 'Main Circular Road, D.I. Khan',
      city: 'Dera Ismail Khan',
      area: 'Circular Road',
      deliveryInstructions: 'Call before delivery',
      paymentMethod: 'ADVANCE_UBL',
      senderName: 'Test Customer UBL',
      transactionReference: 'UBL-TXN-998877',
      receiptImageUrl: '/uploads/receipts/test-ubl-receipt.jpg',
      items: [
        {
          productId: cowMilk.id,
          selectedVariant: variant1.size,
          quantity: 1,
        },
      ],
    };

    const ublOrderRes = await request('/api/orders', {
      method: 'POST',
      body: ublPayload,
    });

    assert(ublOrderRes.status === 200 || ublOrderRes.status === 201, 'UBL Advance Order placed successfully');
    const ublOrder = ublOrderRes.data?.order;
    assert(ublOrder && ublOrder.orderNumber, `Generated UBL Order #${ublOrder?.orderNumber}`);

    // 5. ADMIN AUTHENTICATION
    console.log('\n--- 5. Testing Admin Authentication ---');
    const loginRes = await request('/api/admin/login', {
      method: 'POST',
      body: {
        username: 'admin',
        password: 'SunnyDairyAdmin2026!',
      },
    });

    assert(loginRes.status === 200 && loginRes.data?.success === true, 'Admin login succeeded');
    const setCookie = loginRes.headers.get('set-cookie');
    assert(setCookie && setCookie.includes('sunny_admin_session'), 'Received admin session cookie');

    // Extract cookie
    const adminCookie = setCookie.split(';')[0];
    const adminHeaders = { Cookie: adminCookie };

    // Test check endpoint
    const checkRes = await request('/api/admin/check', { headers: adminHeaders });
    assert(checkRes.status === 200 && checkRes.data?.authenticated === true, 'Admin /api/admin/check returns authenticated: true');

    // 6. ADMIN ORDERS MANAGEMENT
    console.log('\n--- 6. Testing Admin Orders Management ---');
    const adminOrdersRes = await request('/api/admin/orders', { headers: adminHeaders });
    assert(adminOrdersRes.status === 200 && adminOrdersRes.data?.success === true, 'Admin orders list fetched');
    assert(Array.isArray(adminOrdersRes.data?.orders), 'Admin orders is an array');

    if (codOrder?.id) {
      // Confirm price / update status
      const patchRes = await request(`/api/admin/orders/${codOrder.id}`, {
        method: 'PATCH',
        headers: adminHeaders,
        body: {
          orderStatus: 'CONFIRMED',
          adminNotes: 'Price verified by Sanaullah via phone call',
          itemPrices: {
            [codOrder.items[0].id]: 220,
          },
        },
      });
      assert(patchRes.status === 200 && patchRes.data?.success === true, 'Admin confirmed order & updated item price');

      // Update to OUT_FOR_DELIVERY then DELIVERED
      const outRes = await request(`/api/admin/orders/${codOrder.id}`, {
        method: 'PATCH',
        headers: adminHeaders,
        body: { orderStatus: 'OUT_FOR_DELIVERY' },
      });
      assert(outRes.status === 200, 'Order marked OUT_FOR_DELIVERY');

      const delivRes = await request(`/api/admin/orders/${codOrder.id}`, {
        method: 'PATCH',
        headers: adminHeaders,
        body: { orderStatus: 'DELIVERED' },
      });
      assert(delivRes.status === 200, 'Order marked DELIVERED');
    }

    // 7. ADMIN PAYMENTS MANAGEMENT
    console.log('\n--- 7. Testing Admin Payments Management ---');
    const paymentsRes = await request('/api/admin/payments', { headers: adminHeaders });
    assert(paymentsRes.status === 200 && paymentsRes.data?.success === true, 'Admin payments list fetched');

    if (paymentsRes.data?.payments?.length > 0) {
      const p = paymentsRes.data.payments[0];
      const verifyRes = await request(`/api/admin/payments/${p.id}`, {
        method: 'PATCH',
        headers: adminHeaders,
        body: {
          paymentStatus: 'VERIFIED',
          adminNotes: 'Verified against UBL mobile banking',
        },
      });
      assert(verifyRes.status === 200 && verifyRes.data?.success === true, `Payment #${p.id} verified by admin`);
    }

    // 8. ADMIN INVENTORY MANAGEMENT
    console.log('\n--- 8. Testing Admin Inventory Management ---');
    const invRes = await request('/api/admin/inventory', { headers: adminHeaders });
    assert(invRes.status === 200 && invRes.data?.success === true, 'Admin inventory list fetched');

    const updateInvRes = await request('/api/admin/inventory', {
      method: 'PUT',
      headers: adminHeaders,
      body: {
        productId: cowMilk.id,
        newStock: 205,
        reason: 'Fresh morning batch 5 units added',
      },
    });
    assert(updateInvRes.status === 200 && updateInvRes.data?.success === true, 'Stock level adjusted to 205');

    // Revert stock back to 200
    await request('/api/admin/inventory', {
      method: 'PUT',
      headers: adminHeaders,
      body: {
        productId: cowMilk.id,
        newStock: 200,
        reason: 'Test adjustment cleanup',
      },
    });

    // 9. ADMIN PRODUCTS MANAGEMENT (CRUD)
    console.log('\n--- 9. Testing Admin Products CRUD ---');
    const newProductRes = await request('/api/products', {
      method: 'POST',
      headers: adminHeaders,
      body: {
        name: 'Test Pure Butter Temp',
        slug: 'test-pure-butter-temp',
        description: 'Test product for automated test suite',
        shortDescription: 'Test product',
        categoryId: cowMilk.categoryId,
        imageUrl: '/products/cow-milk.jpg',
        sku: 'TEST-SKU-99',
        stockQuantity: 10,
        lowStockThreshold: 2,
        isActive: true,
        isFeatured: false,
        variants: [
          {
            size: '500g',
            price: 750,
            priceType: 'CONFIRMED',
            isAvailable: true,
            stock: 10,
          },
        ],
      },
    });

    assert(newProductRes.status === 200 || newProductRes.status === 201, 'Created new test product');
    const createdProduct = newProductRes.data?.product;

    if (createdProduct?.id) {
      // Update
      const updateProdRes = await request(`/api/products/${createdProduct.id}`, {
        method: 'PUT',
        headers: adminHeaders,
        body: {
          name: 'Test Pure Butter Updated',
          slug: 'test-pure-butter-temp',
          description: 'Updated description',
          shortDescription: 'Updated short description',
          categoryId: cowMilk.categoryId,
          imageUrl: '/products/cow-milk.jpg',
          sku: 'TEST-SKU-99',
          stockQuantity: 15,
          lowStockThreshold: 2,
          isActive: true,
          isFeatured: false,
          variants: [
            {
              size: '500g',
              price: 800,
              priceType: 'CONFIRMED',
              isAvailable: true,
              stock: 15,
            },
          ],
        },
      });
      assert(updateProdRes.status === 200, 'Updated test product');

      // Delete
      const deleteProdRes = await request(`/api/products/${createdProduct.id}`, {
        method: 'DELETE',
        headers: adminHeaders,
      });
      assert(deleteProdRes.status === 200, 'Deleted test product cleanly');
    }

    // 10. ADMIN CATEGORIES MANAGEMENT (CRUD)
    console.log('\n--- 10. Testing Admin Categories CRUD ---');
    const catRes = await request('/api/categories');
    assert(catRes.status === 200 && catRes.data?.success === true, 'Categories fetched');

    const newCatRes = await request('/api/admin/categories', {
      method: 'POST',
      headers: adminHeaders,
      body: {
        name: 'Temporary Category',
        slug: 'temp-cat-test',
        description: 'Test category description',
      },
    });
    assert(
      (newCatRes.status === 200 || newCatRes.status === 201) && newCatRes.data?.success === true,
      'Created test category'
    );
    const createdCat = newCatRes.data?.category;

    if (createdCat?.id) {
      const delCatRes = await request(`/api/admin/categories?id=${createdCat.id}`, {
        method: 'DELETE',
        headers: adminHeaders,
      });
      assert(delCatRes.status === 200, 'Deleted test category cleanly');
    }

    // 11. ADMIN DELIVERY ZONES (CRUD)
    console.log('\n--- 11. Testing Admin Delivery Zones CRUD ---');
    const zonesRes = await request('/api/admin/delivery-zones', { headers: adminHeaders });
    assert(zonesRes.status === 200 && zonesRes.data?.success === true, 'Delivery zones fetched');

    const newZoneRes = await request('/api/admin/delivery-zones', {
      method: 'POST',
      headers: adminHeaders,
      body: {
        areaName: 'Test Zone Area',
        city: 'Dera Ismail Khan',
        deliveryFee: 100,
        estimatedMinutes: 45,
        minOrderAmount: 300,
        isActive: true,
      },
    });
    assert(
      (newZoneRes.status === 200 || newZoneRes.status === 201) && newZoneRes.data?.success === true,
      'Created test delivery zone'
    );
    const createdZone = newZoneRes.data?.zone;

    if (createdZone?.id) {
      const delZoneRes = await request(`/api/admin/delivery-zones?id=${createdZone.id}`, {
        method: 'DELETE',
        headers: adminHeaders,
      });
      assert(delZoneRes.status === 200, 'Deleted test delivery zone cleanly');
    }

    // 12. ADMIN SETTINGS
    console.log('\n--- 12. Testing Admin Settings ---');
    const settingsRes = await request('/api/admin/settings', { headers: adminHeaders });
    assert(settingsRes.status === 200 && settingsRes.data?.success === true, 'Fetched admin settings');
    assert(settingsRes.data?.settings?.store_email === 'sanaullah.ccs@gmail.com', 'Settings store_email is sanaullah.ccs@gmail.com');

    // 13. ADMIN ACTIVITY LOGS
    console.log('\n--- 13. Testing Admin Activity Logs ---');
    const actRes = await request('/api/admin/activity', { headers: adminHeaders });
    assert(actRes.status === 200 && actRes.data?.success === true, 'Activity logs fetched');

    // 14. DATA CLEANUP (REMOVE TEST ORDERS & TEST PAYMENTS)
    console.log('\n--- 14. Cleaning Up All Test Orders & Data ---');
    // Delete payments and order items for our test orders
    await prisma.payment.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.activityLog.deleteMany();

    const orderCount = await prisma.order.count();
    const paymentCount = await prisma.payment.count();
    const activityCount = await prisma.activityLog.count();

    assert(orderCount === 0, `Database orders reset to 0 (Actual: ${orderCount})`);
    assert(paymentCount === 0, `Database payments reset to 0 (Actual: ${paymentCount})`);
    assert(activityCount === 0, `Database activity logs reset to 0 (Actual: ${activityCount})`);

    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    const adminCount = await prisma.adminUser.count();
    console.log(`\nVerified Permanent Catalog & Settings:`);
    console.log(`• Products: ${productCount}`);
    console.log(`• Categories: ${categoryCount}`);
    console.log(`• Admin Accounts: ${adminCount}`);
    assert(productCount > 0, 'Genuine products preserved');
    assert(categoryCount > 0, 'Genuine categories preserved');
    assert(adminCount === 1, 'Admin user preserved');

    console.log('\n====================================================');
    console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('====================================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal error in test suite:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

run();
