# SapphireMart — Full-Stack E-Commerce Web Application

A full-stack e-commerce platform built with **Spring Boot**, **React**, **Oracle SQL**, and **JWT authentication**.

## Features

- Product catalog, cart management, and order tracking for 500+ simulated products across 11 categories, each with a real, category-matched product photo when a Pexels API key is configured.
- Secure authentication and role-based authorization using Spring Security and JWT (customer vs. admin roles).
- Oracle SQL database with indexed columns on `products.category`, `products.name`, `cart_items.user_id`, and `orders.user_id`.
- Saved address book — customers can save, edit, and manage multiple shipping addresses with a default address.
- Admin sales & profit analytics — monthly revenue, profit, and order-count dashboard with a year selector and bar chart.
- Real Razorpay payment integration — server-side order creation, the Razorpay Checkout widget, and HMAC signature verification. Cash on Delivery also available.
- Auto-scrolling homepage and category-page product rails with manual left/right controls, pause-on-hover, and a soft gradient background.
- A 10-unit-per-product cart cap (matches real marketplaces) to keep order totals realistic.
- Mobile-first responsive design: proper slide-in navigation drawer, header icon cluster, and scroll-to-top on every route change.
- RESTful APIs covering auth, products, cart, orders, addresses, payments, and analytics, paginated end-to-end.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3, Spring Security, Spring Data JPA, JWT (jjwt), Razorpay Java SDK |
| Frontend | React 18 (Vite), React Router, Tailwind CSS, Axios, Recharts, Razorpay Checkout.js |
| Database | **Oracle Database** (primary) / H2 in-memory (zero-setup fallback profile) |
| Docs | Swagger / OpenAPI 3.0 at `/swagger-ui.html` |

## Running Locally

### 1. Database — Oracle (primary)

```bash
docker compose up -d
docker compose logs -f oracle   # wait for "DATABASE IS READY TO USE!"
```

Starts Oracle XE 21c on `localhost:1521` with an app user matching the backend defaults (`ecommerce` / `ecommerce` / `XEPDB1`).

**After your machine sleeps/restarts**, the container may need a fresh restart to avoid clock-drift issues:
```bash
docker restart ecommerce-oracle
```

### 2. Get free API keys (both under 5 minutes, no payment/KYC needed)

```bash
export PEXELS_API_KEY=your_pexels_key       # from pexels.com/api
export RAZORPAY_KEY_ID=your_key_id          # from dashboard.razorpay.com
export RAZORPAY_KEY_SECRET=your_key_secret
```

Without these: seeding still works (shared photo per product type instead of unique), and Cash on Delivery still works (online payment shows a clear "not configured" error).

### 3. Backend

```bash
cd backend
mvn spring-boot:run
```

Seeds on first run:
- Admin: `admin@ecommerce.com` / `Admin@123`
- Customer: `user@ecommerce.com` / `User@123`

Quick test without Oracle: `mvn spring-boot:run -Dspring-boot.run.profiles=h2`

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Opens on `http://localhost:5173`, talking to the backend at `http://localhost:8080/api` by default (override via `.env`).

## Key API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/register` / `/api/auth/login` | Public |
| GET | `/api/products?page=&size=&category=&search=&sort=` | Public |
| POST/PUT/DELETE | `/api/admin/products` | Admin only |
| GET/POST | `/api/cart` | Authenticated |
| GET/POST/PUT/DELETE | `/api/addresses` | Authenticated |
| POST | `/api/payments/razorpay/create-order` | Authenticated |
| POST | `/api/orders/checkout` | Authenticated |
| GET | `/api/orders` | Authenticated |
| GET | `/api/admin/orders` | Admin only |
| GET | `/api/admin/analytics/sales?year=` | Admin only |

## Notes

- Razorpay enforces a hard ₹5,00,000 maximum per transaction (not something this app can override in code) — the backend checks this before calling Razorpay and returns a clear error rather than an opaque one.
- Cart quantity is capped at 10 units per product to keep order totals realistic.
- Category names + emojis live in one place (`frontend/src/constants/categories.js`) so the homepage strip and mobile navigation menu never drift out of sync.
