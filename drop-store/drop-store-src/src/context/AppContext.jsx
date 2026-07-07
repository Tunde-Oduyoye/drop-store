import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../lib/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("drop_cart")) || []; } catch { return []; }
  });
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Cart stays in localStorage — guests can shop without an account,
  // and it survives refresh either way.
  useEffect(() => { localStorage.setItem("drop_cart", JSON.stringify(cart)); }, [cart]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // On first load: check if a session cookie already has us logged in
  useEffect(() => {
    api.auth.me()
      .then(({ user }) => {
        setUser(user);
        return api.wishlist.list();
      })
      .then(({ items }) => setWishlist(items || []))
      .catch(() => { /* not logged in - stay as guest */ })
      .finally(() => setAuthChecked(true));
  }, []);

  // Whenever the user logs in, also fetch their order history
  useEffect(() => {
    if (user) {
      api.orders.list().then(({ orders }) => setOrders(orders || [])).catch(() => {});
    } else {
      setOrders([]);
    }
  }, [user]);

  // Cart (client-side, unchanged)
  const addToCart = (product, size, color, qty = 1) => {
    const key = `${product.id}-${size}-${color}`;
    setCart(prev => {
      const exists = prev.find(i => i.key === key);
      if (exists) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, key, selectedSize: size, selectedColor: color, qty }];
    });
    showToast(`${product.name} added to cart`);
    setCartOpen(true);
  };

  const removeFromCart = (key) => setCart(prev => prev.filter(i => i.key !== key));

  const updateQty = (key, qty) => {
    if (qty <= 0) return removeFromCart(key);
    setCart(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  };

  const clearCart = () => setCart([]);

  // Wishlist (real API - requires login)
  const toggleWishlist = async (product) => {
    if (!user) {
      showToast("Sign in to save items to your wishlist", "info");
      return;
    }
    const exists = wishlist.some(i => i.id === product.id);
    try {
      if (exists) {
        await api.wishlist.remove(product.id);
        setWishlist(prev => prev.filter(i => i.id !== product.id));
        showToast("Removed from wishlist", "info");
      } else {
        await api.wishlist.add(product.id);
        setWishlist(prev => [...prev, product]);
        showToast("Added to wishlist ❤️");
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const isWishlisted = (id) => wishlist.some(i => i.id === id);

  // Orders (real API)
  const placeOrder = async (orderData) => {
    try {
      const { order } = await api.orders.create({
        items: cart.map(i => ({ productId: i.id, size: i.selectedSize, color: i.selectedColor, qty: i.qty })),
        deliveryAddress: orderData.address,
        phone: orderData.phone,
        paymentMethod: orderData.payMethod,
        promoCode: orderData.promoCode,
      });
      setOrders(prev => [order, ...prev]);
      clearCart();
      showToast("Order placed successfully! 🎉");
      return order;
    } catch (err) {
      showToast(err.message, "error");
      throw err;
    }
  };

  // Auth (real API)
  // `rememberMe` is passed through to the backend so it can (optionally)
  // issue a longer-lived session cookie. If your Express login route
  // doesn't read this field yet, it's simply ignored server-side — the
  // frontend still remembers the email for next time either way.
  const login = async (email, password, rememberMe = false) => {
    const { user } = await api.auth.login(email, password, rememberMe);
    setUser(user);
    const { items } = await api.wishlist.list().catch(() => ({ items: [] }));
    setWishlist(items || []);
    showToast(`Welcome back, ${user.name}!`);
  };

  // Sends a reset link to the given email. Doesn't touch local state —
  // it's a fire-and-forget request the login form waits on and reports
  // success/failure for.
  const forgotPassword = async (email) => {
    const res = await api.auth.forgotPassword(email);
    return res;
  };

  // Completes a reset using the token from the emailed link.
  const resetPassword = async (token, newPassword) => {
    const res = await api.auth.resetPassword(token, newPassword);
    return res;
  };

  const register = async (name, email, password) => {
    const { user } = await api.auth.register(name, email, password);
    setUser(user);
    showToast(`Welcome to DRØP, ${user.name}!`);
  };

  const logout = async () => {
    await api.auth.logout().catch(() => {});
    setUser(null);
    setWishlist([]);
    setOrders([]);
    showToast("Logged out successfully", "info");
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <AppContext.Provider value={{
      cart, cartOpen, setCartOpen, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal,
      wishlist, toggleWishlist, isWishlisted,
      user, login, logout, register, authChecked, forgotPassword, resetPassword,
      orders, placeOrder,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};
