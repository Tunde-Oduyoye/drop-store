import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation, useParams, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Navbar, CartDrawer, SearchModal, MobileBottomNav, Footer, Toast } from "./components/Shared";
import HomePage from "./pages/HomePage";
import CollectionPage from "./pages/CollectionPage";
import ProductPage from "./pages/ProductPage";
import {
  LoginPage, RegisterPage, AccountPage, WishlistPage,
  CheckoutPage, LookbookPage, FAQPage, AboutPage, ContactPage,
  ForgotPasswordPage, ResetPasswordPage
} from "./pages/OtherPages";
import { getProductBySlug, slugify } from "./data/products";

// Maps the "target" tokens used throughout the app (onNavigate("JEANS"),
// onNavigate("ACCOUNT"), etc.) to real, bookmarkable URLs.
const TARGET_TO_PATH = {
  HOME: "/",
  COLLECTION: "/collection",
  TOPS: "/tops",
  JEANS: "/jeans",
  CAPS: "/caps",
  SHOES: "/shoes",
  WATCHES: "/watches",
  BELTS: "/belts",
  BOXERS: "/boxers",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  REGISTER: "/register",
  ACCOUNT: "/account",
  WISHLIST: "/wishlist",
  CHECKOUT: "/checkout",
  LOOKBOOK: "/lookbook",
  FAQ: "/faq",
  ABOUT: "/about",
  CONTACT: "/contact",
  SIZEGUIDE: "/size-guide",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  COOKIES: "/cookies",
};

// Reverse of the map above — used so the Navbar/MobileBottomNav can
// highlight the correct link based on whatever URL the user is on
// (including ones reached via back/forward or a bookmark, not just clicks).
const PATH_TO_TARGET = Object.fromEntries(
  Object.entries(TARGET_TO_PATH).map(([token, path]) => [path, token])
);

// Resolves /products/:slug -> the matching product, then renders the
// existing ProductPage component unchanged. If the slug doesn't match
// anything (e.g. a stale/bad link), send the person home instead of
// crashing on `product.whatever`.
function ProductRoute({ onNavigate }) {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  if (!product) return <Navigate to="/" replace />;
  return <ProductPage product={product} onNavigate={onNavigate} key={product.id} />;
}

function AppContent() {
  const [searchOpen, setSearchOpen] = useState(false);
  const routerNavigate = useNavigate();
  const location = useLocation();

  const currentPage =
    PATH_TO_TARGET[location.pathname] ||
    (location.pathname.startsWith("/products/") ? "PRODUCT" : "HOME");

  // Same signature every page/component already calls: navigate(target, payload).
  // Underneath, it now pushes a real URL instead of just flipping state.
  const navigate = (target, payload = null) => {
    if (target === "PRODUCT" && payload) {
      const slug = payload.slug || slugify(payload.name);
      routerNavigate(`/products/${slug}`);
    } else if (target === "SEARCH") {
      setSearchOpen(true);
      return;
    } else {
      routerNavigate(TARGET_TO_PATH[target] || "/");
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Keyboard shortcut: ESC closes search
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") setSearchOpen(false); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Scroll to top on every route change — covers browser back/forward too,
  // not just clicks that go through navigate() above.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      <Navbar
        onNavigate={navigate}
        currentPage={currentPage}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
      />

      <main>
        <Routes>
          <Route path="/" element={<HomePage onNavigate={navigate} />} />
          <Route path="/collection" element={<CollectionPage onNavigate={navigate} />} />
          <Route path="/tops" element={<CollectionPage onNavigate={navigate} filterCategory="Tops" />} />
          <Route path="/jeans" element={<CollectionPage onNavigate={navigate} filterCategory="Jeans" />} />
          <Route path="/caps" element={<CollectionPage onNavigate={navigate} filterCategory="Caps" />} />
          <Route path="/shoes" element={<CollectionPage onNavigate={navigate} filterCategory="Shoes" />} />
          <Route path="/watches" element={<CollectionPage onNavigate={navigate} filterCategory="Watches" />} />
          <Route path="/belts" element={<CollectionPage onNavigate={navigate} filterCategory="Belts" />} />
          <Route path="/boxers" element={<CollectionPage onNavigate={navigate} filterCategory="Boxers" />} />
          <Route path="/products/:slug" element={<ProductRoute onNavigate={navigate} />} />
          <Route path="/login" element={<LoginPage onNavigate={navigate} />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage onNavigate={navigate} />} />
          <Route path="/register" element={<RegisterPage onNavigate={navigate} />} />
          <Route path="/account" element={<AccountPage onNavigate={navigate} />} />
          <Route path="/wishlist" element={<WishlistPage onNavigate={navigate} />} />
          <Route path="/checkout" element={<CheckoutPage onNavigate={navigate} />} />
          <Route path="/lookbook" element={<LookbookPage onNavigate={navigate} />} />
          <Route path="/faq" element={<FAQPage onNavigate={navigate} />} />
          <Route path="/size-guide" element={<FAQPage onNavigate={navigate} />} />
          <Route path="/privacy" element={<FAQPage onNavigate={navigate} />} />
          <Route path="/terms" element={<FAQPage onNavigate={navigate} />} />
          <Route path="/cookies" element={<FAQPage onNavigate={navigate} />} />
          <Route path="/about" element={<AboutPage onNavigate={navigate} />} />
          <Route path="/contact" element={<ContactPage onNavigate={navigate} />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage onNavigate={navigate} />} />
          <Route path="*" element={<HomePage onNavigate={navigate} />} />
        </Routes>
      </main>

      <Footer onNavigate={navigate} />
      <MobileBottomNav onNavigate={navigate} currentPage={currentPage} setSearchOpen={setSearchOpen} />

      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={navigate} />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
