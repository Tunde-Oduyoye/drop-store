const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://drop-server-0124.onrender.com/api" : "http://localhost:5000/api");

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const api = {
  auth: {
    login: (email, password) => request("/auth/admin-login", { method: "POST", body: JSON.stringify({ email, password }) }),
    logout: () => request("/auth/admin-logout", { method: "POST" }),
    me: () => request("/auth/admin-me"),
    updateProfile: (data) => request("/auth/profile", { method: "PATCH", body: JSON.stringify(data) }),
    changePassword: (currentPassword, newPassword) => request("/auth/password", { method: "PATCH", body: JSON.stringify({ currentPassword, newPassword }) }),
  },
  products: {
    list: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/products${q ? `?${q}` : ""}`);
    },
    get: (id) => request(`/products/${id}`),
    create: (data) => request("/products", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => request(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id) => request(`/products/${id}`, { method: "DELETE" }),
  },
  orders: {
    listAll: (status) => request(`/orders/admin/all${status ? `?status=${status}` : ""}`),
    updateStatus: (id, status) => request(`/orders/admin/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
    stats: () => request("/orders/admin/stats"),
  },
  upload: {
    image: (base64data, filename) => request("/upload", { method: "POST", body: JSON.stringify({ data: base64data, filename }) }),
  },
};
