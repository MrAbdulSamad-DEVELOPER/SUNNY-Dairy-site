# SUNNY Dairy — Full-Stack Production E-Commerce Platform

A production-grade, full-stack dairy and traditional sweets e-commerce platform built for **SUNNY Dairy**, owned and operated by **Sanaullah**, delivering 100% pure farm-fresh milk, cultured dahi, pure makhan, desi ghee, and authentic sweets across **Dera Ismail Khan, Khyber Pakhtunkhwa, Pakistan**.

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
  - Prisma ORM (`prisma/schema.prisma`) with zero-config local SQLite (`dev.db`)
- **Validation & Forms:** Zod, React Hook Form
- **Order & Payment System:**
  - **Option 1: Advance Payment (UBL Bank Transfer)**
    - Bank: United Bank Limited (UBL)
    - Account Number: `236525896`
    - Account Title: SUNNY Dairy / Sanaullah
    - Customer uploads payment receipt screenshot for manual admin bank statement reconciliation.
  - **Option 2: Direct WhatsApp Order**
    - Official WhatsApp: `+96895234002` (`https://wa.me/96895234002`)
    - Automatically formats and prefills complete customer and item order details.
- **Admin Management:**
  - Payments verification dashboard (`/admin/payments`) with manual verification and rejection auditing.
  - Complete order, inventory, customer, product, and delivery zone management.

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

### 1. Installation
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Database Initialization
```bash
# Push schema to SQLite
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
# or production build
npm run build
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛡️ Admin Portal Credentials

- **URL:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Username:** `admin` (or `admin@sunnydairy.pk`)
- **Password:** `SunnyDairyAdmin2026!`

---

## 🧪 Automated Testing

Run the test suite:
```bash
npm test
```

Type check:
```bash
npx tsc --noEmit
```
