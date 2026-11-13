# Sher Milk — Full-Stack Dairy & Traditional Sweets E-Commerce Platform

A production-grade, full-stack e-commerce platform built for **Sher Milk**, delivering fresh cow milk, goat milk, cultured dahi, pure makhan, desi ghee, and authentic Pakistani mithai across Lahore, Pakistan.

---

## 🥛 Architecture & Technology Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Design System:**
  - Warm cream background (`#FAF6ED`)
  - Deep forest green (`#124B32`) & accent golden yellow (`#E6AE4C`)
  - Typography: Playfair Display (Serif headings) & DM Sans (Interface & body)
- **Backend & Database:**
  - TypeScript Route Handlers & Server Actions
  - PostgreSQL / Supabase enterprise schema (`schema.sql`)
  - Prisma ORM (`prisma/schema.prisma`) with zero-config local SQLite (`dev.db`) and instant PostgreSQL switch
- **Validation & Forms:** Zod, React Hook Form
- **Cart & Order System:**
  - Full client-side persistent cart state with local storage hydration
  - Dual price support: Confirmed fixed pricing & "Price on Request"
  - Server-side authoritative price retrieval (never trusts client-side prices)
  - Dedicated order snapshot records for historical price fidelity
- **Integrations:**
  - WhatsApp Business Direct Order Formatting (`wa.me`)
  - Cash on Delivery workflow
  - Role-based Admin Dashboard with session authentication and cookie encryption

---

## 📦 Complete Product Catalog

| Product | Category | Available Sizes | Pricing Model |
| :--- | :--- | :--- | :--- |
| **Fresh Cow Milk** | Milk & Yogurt | 1L, 2L, 5L | Price on Request |
| **Fresh Goat Milk** | Milk & Yogurt | 1L, 2L, 5L | Price on Request |
| **Fresh Yogurt (Dahi)** | Milk & Yogurt | 500g, 1kg, 2kg | Price on Request |
| **Pure Makhan** | Dairy Products | 250g, 500g, 1kg | **Rs. 1,500** (1kg confirmed); 250g/500g Price on Request |
| **Desi Pure Ghee** | Dairy Products | 250g, 500g, 1kg | **Rs. 2,600** (1kg confirmed); 250g/500g Price on Request |
| **Fresh Paneer** | Dairy Products | 250g, 500g, 1kg | Price on Request |
| **Barfi** | Traditional Sweets | 250g, 500g, 1kg | Price on Request |
| **Badayuni Peda** | Traditional Sweets | 250g, 500g, 1kg | Price on Request |
| **Kalakand** | Traditional Sweets | 250g, 500g, 1kg | Price on Request |
| **Fresh Rabri** | Traditional Sweets | 250g, 500g, 1kg | Price on Request |
| **Fresh Lassi** | Drinks | 500ml, 1L | Price on Request |

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### 2. Installation
```bash
# Clone or navigate to project directory
cd milk-web

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default configuration in `.env`:
```ini
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_WHATSAPP_NUMBER="923000000000"
NEXT_PUBLIC_STORE_NAME="Sher Milk"
NEXT_PUBLIC_STORE_PHONE="+92 300 0000000"
NEXT_PUBLIC_STORE_EMAIL="info@shermilk.pk"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="SherMilkAdmin2026!"
ADMIN_SESSION_SECRET="sher-milk-super-secure-production-session-secret-key-32chars"
```

### 4. Database Initialization & Seeding
```bash
# Push schema to SQLite
npx prisma db push

# Seed 11 products, variants, confirmed rates, and categories
node prisma/seed.js
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Admin Dashboard & Portal

- **URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Default Username:** `admin`
- **Default Password:** `SherMilkAdmin2026!`

### Admin Capabilities:
1. **Overview Dashboard:** Total orders, pending action items, confirmed deliveries, delivered volume, confirmed sales revenue, and top-selling dairy products.
2. **Order Management (`/admin/orders`):**
   - Search by order number, customer name, phone, or neighborhood.
   - Filter by status: `PENDING`, `PRICE_CONFIRMATION_REQUIRED`, `CONFIRMED`, `PREPARING`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`.
   - **Price Confirmation System:** Input authoritative unit prices for unpriced daily items. Automatically updates final total without misleading customers.
   - Direct WhatsApp message button with pre-formatted notification text.
3. **Product & Rate Management (`/admin/products`):**
   - Add/edit products, descriptions, categories, images.
   - Configure size variants with fixed prices or set as "Price on Request".
   - Toggle product visibility or featured badge.
4. **Settings (`/admin/settings`):**
   - Update WhatsApp business contact, phone number, and delivery zones.

---

## 🗄️ Database Schema & PostgreSQL / Supabase Setup

A PostgreSQL schema DDL is provided in `schema.sql`.

To deploy to Supabase or PostgreSQL:
1. Run `schema.sql` in Supabase SQL Editor.
2. In your `.env` or hosting provider, set:
   ```ini
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres?sslmode=require"
   ```
3. Run `npx prisma db push` and `node prisma/seed.js`.

---

## 🧪 Automated Testing

Run the test suite:
```bash
npm test
```
The suite verifies:
- WhatsApp order message syntax and URL encoding
- Customer checkout input validation schemas
- Price confirmation calculations (confirmed subtotal vs pending items)
- Admin HMAC session token signing and verification

Type check:
```bash
npx tsc --noEmit
```

Production build:
```bash
npm run build
```
