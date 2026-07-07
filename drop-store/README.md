# DRØP — Full Frontend (React + Tailwind CSS)

A complete, fully-functional frontend for a streetwear multi-category clothing
store. No backend included — this is pure frontend with realistic mock data,
ready to wire up to your Express API.

## Quick Start

```bash
cd drop-store
npm install
npm run dev
```

Open the URL shown in your terminal (usually `http://localhost:5173`).

To build for production:
```bash
npm run build
```

## What's included

### Pages (all built and wired together)
- **Home** — hero, categories, new arrivals, lookbook teaser, bestsellers, reviews
- **Collection / Category pages** — Tops, Jeans, Caps, Shoes, Watches, Belts, Boxers
  — each with working filters (category, size, price), sort, and search
- **Product detail page** — gallery, color/size picker, qty selector, tabs
  (description, reviews, size guide, shipping), related products, write-a-review form
- **Cart drawer** — slide-in, quantity controls, free shipping progress, remove items
- **Checkout** — 2-step flow (delivery details → payment), promo code (`DRØP15`
  gives 15% off), order confirmation screen
- **Login / Register** — form validation, error states
- **Account** — order history, wishlist tab, profile tab, addresses tab
- **Wishlist** — standalone page, syncs with heart icon across the whole site
- **Lookbook** — full editorial page with shoppable outfit bundles
- **FAQ** — accordion-style, 8 real questions
- **About** — brand story page
- **Contact** — working contact form with validation

### Functionality that actually works
- Cart and wishlist persist via `localStorage` (refresh-proof)
- Live search with autocomplete (press the search icon or bottom nav)
- All filters and sorting work on the Collection page
- Toast notifications for every action (add to cart, wishlist, login, etc.)
- Responsive — fully separate, polished mobile layout (bottom nav, slide-in menus)
- Promo code system (try `DRØP15` at checkout)
- Form validation on login, register, checkout, contact, and reviews

## Connecting to your Express backend

Everything currently uses mock data from `src/data/products.js` and local state
in `src/context/AppContext.jsx`. To connect your Express API:

1. Replace `ALL_PRODUCTS` import in pages with a `fetch('/api/products')` call
   (consider React Query for caching)
2. In `AppContext.jsx`, replace the `localStorage` cart/wishlist persistence
   with real API calls to your `/api/cart` and `/api/wishlist` routes
3. Replace `login`/`register` functions with real calls to
   `/api/auth/login` and `/api/auth/register`, storing the JWT in an httpOnly
   cookie (set by your Express backend)
4. Replace `placeOrder` with a call to `/api/orders` that also triggers
   Paystack payment initialization

## Project structure

```
src/
  components/Shared.jsx     → Navbar, CartDrawer, ProductCard, Footer, etc.
  context/AppContext.jsx    → Global state: cart, wishlist, auth, orders
  data/products.js          → Mock product data (replace with API calls)
  pages/                    → One file per page
  App.jsx                   → Routing logic (simple state-based, no router lib)
```

Note: this project uses simple state-based navigation instead of React Router
to keep things lightweight. If you prefer React Router for real URLs
(e.g. `/products/123`), it's a quick swap — happy to set that up if needed.

## Brand

Name: **DRØP** — Premium streetwear, limited drops, dark/bold aesthetic.
Currency: Nigerian Naira (₦). Change in `src/data/products.js` → `fmt()` function
if your client needs a different currency.
