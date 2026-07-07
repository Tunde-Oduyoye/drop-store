// Centralized API client — every backend call goes through here.
// Base URL points to your local Express server during development.
// When you deploy, change this to your live Render backend URL
// (e.g. via an environment variable — see note at the bottom).

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include", // sends/receives the httpOnly auth cookie
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

// ── Auth ──────────────────────────────────────────────────
export const api = {
  auth: {
    register: (name, email, password) =>
      request("/auth/register", { method: "POST", body: JSON.stringify({ name, email, password }) }),
    login: (email, password, rememberMe = false) =>
      request("/auth/login", { method: "POST", body: JSON.stringify({ email, password, rememberMe }) }),
    logout: () => request("/auth/logout", { method: "POST" }),
    me: () => request("/auth/me"),
    updateProfile: (data) => request("/auth/profile", { method: "PATCH", body: JSON.stringify(data) }),
    changePassword: (currentPassword, newPassword) =>
      request("/auth/password", { method: "PATCH", body: JSON.stringify({ currentPassword, newPassword }) }),
    // Sends a password-reset link to the given email.
    // Expects your Express backend to expose POST /auth/forgot-password
    // — see the note at the bottom of this file for the expected contract.
    forgotPassword: (email) =>
      request("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
    // Completes a reset using the token from the emailed link.
    // Expects POST /auth/reset-password — see note at the bottom of this file.
    resetPassword: (token, newPassword) =>
      request("/auth/reset-password", { method: "POST", body: JSON.stringify({ token, newPassword }) }),
  },

  // ── Products ────────────────────────────────────────────
  products: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/products${query ? `?${query}` : ""}`);
    },
    get: (idOrSlug) => request(`/products/${idOrSlug}`),
    related: (id) => request(`/products/${id}/related`),
  },

  // ── Wishlist ────────────────────────────────────────────
  wishlist: {
    list: () => request("/wishlist"),
    add: (productId) => request("/wishlist", { method: "POST", body: JSON.stringify({ productId }) }),
    remove: (productId) => request(`/wishlist/${productId}`, { method: "DELETE" }),
  },

  // ── Reviews ─────────────────────────────────────────────
  reviews: {
    list: (productId) => request(`/reviews/${productId}`),
    create: (productId, rating, text) =>
      request(`/reviews/${productId}`, { method: "POST", body: JSON.stringify({ rating, text }) }),
  },

  // ── Orders ──────────────────────────────────────────────
  orders: {
    create: (orderData) => request("/orders", { method: "POST", body: JSON.stringify(orderData) }),
    list: () => request("/orders"),
    get: (id) => request(`/orders/${id}`),
  },

  // ── Payments ────────────────────────────────────────────
  payments: {
    initialize: (orderId) => request("/payments/initialize", { method: "POST", body: JSON.stringify({ orderId }) }),
    verify: (reference) => request(`/payments/verify/${reference}`),
  },
};

// NOTE on deploying later:
// Create a file called `.env` in your drop-store root (same level as package.json) with:
//   VITE_API_URL=https://your-render-backend-url.onrender.com/api
// Vite automatically picks this up — no code changes needed here.

// NOTE on "Forgot password" — backend contract this frontend expects:
//
//   POST /auth/forgot-password   body: { email }
//     - Always respond 200 with something like { message: "..." } even if
//       the email doesn't exist (don't leak which emails are registered).
//     - Generate a one-time reset token, email the user a link like:
//       https://yourapp.com/reset-password/<token>
//
//   POST /auth/reset-password    body: { token, newPassword }
//     - 200 + { message } on success.
//     - 400 + { error: "Invalid or expired token" } if the token is bad/expired.
//
// The frontend already has a full UI for both steps (LoginPage's "Forgot
// password?" flow, and the ResetPasswordPage at /reset-password/:token in
// OtherPages.jsx). If these two routes don't exist on your Express server
// yet, the request will fail with a network/404 error and the UI will show
// that error message — add the two routes above to make it fully work.
