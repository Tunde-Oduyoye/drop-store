import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { fmt, CATEGORIES, ANNOUNCEMENTS, ALL_PRODUCTS } from "../data/products";

// ── Stars ─────────────────────────────────────────────────
export function Stars({ rating, size = "sm" }) {
  const s = size === "lg" ? "w-5 h-5" : "w-3 h-3";
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`${s} ${i <= Math.round(rating) ? "text-amber-400" : "text-zinc-700"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────
export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const colors = { success: "bg-emerald-500", info: "bg-zinc-700", error: "bg-red-500" };
  return (
    <div className={`fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-[100] ${colors[toast.type] || colors.success} text-white px-6 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 animate-bounce-in`}>
      {toast.type === "success" && <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
      {toast.msg}
    </div>
  );
}

// ── CartDrawer ────────────────────────────────────────────
export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty, cartTotal, cartCount } = useApp();
  const shipping = cartTotal >= 30000 ? 0 : 2500;

  return (
    <>
      <div className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setCartOpen(false)} />
      <div className={`fixed right-0 top-0 h-full w-full max-w-sm bg-zinc-950 border-l border-zinc-800 z-50 flex flex-col transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <span className="text-white font-bold tracking-wider">CART ({cartCount})</span>
          <button onClick={() => setCartOpen(false)} className="text-zinc-400 hover:text-white transition-colors p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-6xl mb-4 opacity-20">🛒</div>
              <p className="text-zinc-400 font-semibold">Your cart is empty</p>
              <p className="text-zinc-600 text-sm mt-1">Add items to get started</p>
              <button onClick={() => setCartOpen(false)} className="mt-6 border border-zinc-700 text-zinc-300 px-6 py-2.5 rounded-xl text-sm hover:border-zinc-500 transition-colors">
                Continue Shopping
              </button>
            </div>
          ) : cart.map(item => (
            <div key={item.key} className="flex gap-3 bg-zinc-900 rounded-xl p-3 border border-zinc-800">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl flex-shrink-0" style={{background:`radial-gradient(ellipse,${item.selectedColor || item.colors[0]}22,#111)`}}>
                {CATEGORIES.find(c => c.name === item.category)?.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                <p className="text-zinc-500 text-xs mt-0.5">Size: {item.selectedSize} · {item.category}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 bg-zinc-800 rounded-lg px-2 py-1">
                    <button onClick={() => updateQty(item.key, item.qty - 1)} className="text-zinc-400 hover:text-white w-5 h-5 flex items-center justify-center">−</button>
                    <span className="text-white text-xs w-5 text-center font-semibold">{item.qty}</span>
                    <button onClick={() => updateQty(item.key, item.qty + 1)} className="text-zinc-400 hover:text-white w-5 h-5 flex items-center justify-center">+</button>
                  </div>
                  <span className="text-white text-sm font-bold">{fmt(item.price * item.qty)}</span>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.key)} className="text-zinc-700 hover:text-red-400 transition-colors self-start p-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          ))}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-zinc-800 px-6 py-5 space-y-3">
            {shipping === 0 && <div className="flex items-center gap-2 text-emerald-400 text-xs bg-emerald-500/10 rounded-lg px-3 py-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              You've unlocked free delivery!
            </div>}
            {shipping > 0 && <p className="text-zinc-500 text-xs text-center">Add {fmt(30000 - cartTotal)} more for free delivery</p>}
            <div className="flex justify-between text-sm"><span className="text-zinc-400">Subtotal</span><span className="text-white font-bold">{fmt(cartTotal)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-zinc-400">Shipping</span><span className={shipping === 0 ? "text-emerald-400 font-semibold" : "text-white"}>{shipping === 0 ? "FREE" : fmt(shipping)}</span></div>
            <div className="flex justify-between font-bold border-t border-zinc-800 pt-3"><span className="text-white">Total</span><span className="text-white text-lg">{fmt(cartTotal + shipping)}</span></div>
            <a href="#checkout" onClick={() => setCartOpen(false)} className="block w-full bg-white text-black py-4 rounded-xl font-bold tracking-wider text-center hover:bg-zinc-100 transition-colors">
              CHECKOUT
            </a>
            <button onClick={() => setCartOpen(false)} className="w-full border border-zinc-800 text-zinc-400 py-3 rounded-xl text-sm hover:border-zinc-600 transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ── MobileMenu ────────────────────────────────────────────
export function MobileMenu({ isOpen, onClose, onNavigate }) {
  const { user, logout } = useApp();
  const [collectionOpen, setCollectionOpen] = useState(false);

  const go = (link) => { onNavigate(link); onClose(); };

  return (
    <>
      <div className={`fixed inset-0 bg-black/80 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={onClose}/>
      <div className={`fixed top-0 left-0 h-full w-72 bg-zinc-950 border-r border-zinc-800 z-50 flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
          <span className="text-white font-black text-xl tracking-widest">DRØP</span>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <button onClick={() => go("HOME")}
            className="flex items-center justify-between w-full py-3.5 px-2 text-zinc-300 hover:text-white text-sm font-semibold tracking-widest border-b border-zinc-900/50 transition-colors text-left">
            HOME
            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>

          <div className="border-b border-zinc-900/50">
            <button onClick={() => setCollectionOpen(v => !v)}
              className="flex items-center justify-between w-full py-3.5 px-2 text-zinc-300 hover:text-white text-sm font-semibold tracking-widest transition-colors text-left">
              COLLECTION
              <svg className={`w-4 h-4 text-zinc-600 transition-transform duration-200 ${collectionOpen ? "rotate-90" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
            <div className={`overflow-hidden transition-all duration-200 ${collectionOpen ? "max-h-96 pb-2" : "max-h-0"}`}>
              <button onClick={() => go("COLLECTION")} className="block w-full py-2.5 pl-6 pr-2 text-zinc-400 hover:text-white text-sm text-left transition-colors">
                All Products
              </button>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => go(cat.name.toUpperCase())}
                  className="block w-full py-2.5 pl-6 pr-2 text-zinc-400 hover:text-white text-sm text-left transition-colors">
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => go("LOOKBOOK")}
            className="flex items-center justify-between w-full py-3.5 px-2 text-zinc-300 hover:text-white text-sm font-semibold tracking-widest border-b border-zinc-900/50 transition-colors text-left">
            LOOKBOOK
            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>

          <button onClick={() => go("ABOUT")}
            className="flex items-center justify-between w-full py-3.5 px-2 text-zinc-300 hover:text-white text-sm font-semibold tracking-widest border-b border-zinc-900/50 transition-colors text-left">
            ABOUT
            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>

          <button onClick={() => go("CONTACT")}
            className="flex items-center justify-between w-full py-3.5 px-2 text-zinc-300 hover:text-white text-sm font-semibold tracking-widest border-b border-zinc-900/50 transition-colors text-left">
            CONTACT
            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
          </button>
        </nav>
        <div className="px-4 py-5 border-t border-zinc-800 space-y-2">
          {user ? (
            <>
              <button onClick={() => { onNavigate("ACCOUNT"); onClose(); }} className="w-full border border-zinc-700 text-zinc-300 py-3 rounded-xl text-sm font-medium">My Account</button>
              <button onClick={() => { logout(); onClose(); }} className="w-full border border-zinc-800 text-zinc-500 py-3 rounded-xl text-sm">Sign Out</button>
            </>
          ) : (
            <>
              <button onClick={() => { onNavigate("LOGIN"); onClose(); }} className="w-full border border-zinc-700 text-zinc-300 py-3 rounded-xl text-sm font-medium">Sign In</button>
              <button onClick={() => { onNavigate("REGISTER"); onClose(); }} className="w-full bg-white text-black py-3 rounded-xl text-sm font-bold tracking-wider">Create Account</button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── Navbar ────────────────────────────────────────────────
export function Navbar({ onNavigate, currentPage, searchQuery, setSearchQuery, searchOpen, setSearchOpen }) {
  const { cartCount, wishlist, setCartOpen, user } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [collectionOpen, setCollectionOpen] = useState(false);

  const categoryTokens = CATEGORIES.map(c => c.name.toUpperCase());
  const isCollectionActive = currentPage === "COLLECTION" || categoryTokens.includes(currentPage);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const iv = setInterval(() => setAnnouncementIndex(i => (i + 1) % ANNOUNCEMENTS.length), 3500);
    return () => clearInterval(iv);
  }, []);

  return (
    <>
      {/* Announcement */}
      <div className="bg-zinc-900 border-b border-zinc-800 py-2.5 px-4 text-center">
        <p className="text-xs text-zinc-300 tracking-wide">{ANNOUNCEMENTS[announcementIndex]}</p>
      </div>

      {/* Nav */}
      <nav className={`sticky top-0 z-30 transition-all duration-300 ${scrolled ? "bg-black/95 backdrop-blur-xl shadow-xl shadow-black/50" : "bg-black"} border-b border-zinc-900`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => setMobileMenuOpen(true)} className="md:hidden text-zinc-400 hover:text-white p-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
            </button>

            <button onClick={() => onNavigate("HOME")} className="font-black text-2xl tracking-widest text-white select-none">DRØP</button>

            <div className="hidden md:flex items-center">
              <button onClick={() => onNavigate("HOME")}
                className={`px-3 py-2 text-xs font-semibold tracking-widest transition-colors relative group ${currentPage === "HOME" ? "text-white" : "text-zinc-400 hover:text-white"}`}>
                HOME
                <span className={`absolute bottom-0 left-3 right-3 h-px bg-white transition-transform duration-200 ${currentPage === "HOME" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}/>
              </button>

              <div className="relative" onMouseEnter={() => setCollectionOpen(true)} onMouseLeave={() => setCollectionOpen(false)}>
                <button onClick={() => onNavigate("COLLECTION")}
                  className={`flex items-center gap-1 px-3 py-2 text-xs font-semibold tracking-widest transition-colors relative group ${isCollectionActive || collectionOpen ? "text-white" : "text-zinc-400 hover:text-white"}`}>
                  COLLECTION
                  <svg className={`w-3 h-3 transition-transform duration-200 ${collectionOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  <span className={`absolute bottom-0 left-3 right-3 h-px bg-white transition-transform duration-200 ${isCollectionActive || collectionOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}/>
                </button>

                {/* Invisible bridge + dropdown panel */}
                <div className={`absolute top-full left-0 pt-2 transition-opacity duration-150 ${collectionOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl shadow-black/50 py-2 min-w-[180px]">
                    {CATEGORIES.map(cat => (
                      <button key={cat.id} onClick={() => { onNavigate(cat.name.toUpperCase()); setCollectionOpen(false); }}
                        className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${currentPage === cat.name.toUpperCase() ? "text-white bg-zinc-900" : "text-zinc-400 hover:text-white hover:bg-zinc-900"}`}>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={() => onNavigate("LOOKBOOK")}
                className={`px-3 py-2 text-xs font-semibold tracking-widest transition-colors relative group ${currentPage === "LOOKBOOK" ? "text-white" : "text-zinc-400 hover:text-white"}`}>
                LOOKBOOK
                <span className={`absolute bottom-0 left-3 right-3 h-px bg-white transition-transform duration-200 ${currentPage === "LOOKBOOK" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}/>
              </button>

              <button onClick={() => onNavigate("ABOUT")}
                className={`px-3 py-2 text-xs font-semibold tracking-widest transition-colors relative group ${currentPage === "ABOUT" ? "text-white" : "text-zinc-400 hover:text-white"}`}>
                ABOUT
                <span className={`absolute bottom-0 left-3 right-3 h-px bg-white transition-transform duration-200 ${currentPage === "ABOUT" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}/>
              </button>

              <button onClick={() => onNavigate("CONTACT")}
                className={`px-3 py-2 text-xs font-semibold tracking-widest transition-colors relative group ${currentPage === "CONTACT" ? "text-white" : "text-zinc-400 hover:text-white"}`}>
                CONTACT
                <span className={`absolute bottom-0 left-3 right-3 h-px bg-white transition-transform duration-200 ${currentPage === "CONTACT" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`}/>
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button onClick={() => setSearchOpen(true)} className="p-2 text-zinc-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </button>
              <button onClick={() => onNavigate("WISHLIST")} className="p-2 text-zinc-400 hover:text-white transition-colors relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                {wishlist.length > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white font-bold">{wishlist.length}</span>}
              </button>
              <button onClick={() => setCartOpen(true)} className="p-2 text-zinc-400 hover:text-white transition-colors relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                {cartCount > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-white rounded-full text-[9px] flex items-center justify-center text-black font-bold">{cartCount}</span>}
              </button>
              <button onClick={() => onNavigate(user ? "ACCOUNT" : "LOGIN")} className="hidden sm:block p-2 text-zinc-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} onNavigate={onNavigate} />
    </>
  );
}

// ── SearchModal ───────────────────────────────────────────
export function SearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState("");
  const results = query.length > 1
    ? ALL_PRODUCTS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  useEffect(() => { if (!isOpen) setQuery(""); }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] bg-black/97 backdrop-blur-xl flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-4 pt-16 sm:pt-24">
        <div className="flex items-center gap-4 border-b border-zinc-700 pb-4 mb-6">
          <svg className="w-5 h-5 text-zinc-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input autoFocus type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search products, categories..."
            className="flex-1 bg-transparent text-white text-lg placeholder-zinc-600 focus:outline-none" />
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xs tracking-widest border border-zinc-800 px-3 py-1.5 rounded-lg">ESC</button>
        </div>

        {query.length > 1 && (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3 opacity-30">🔍</div>
                <p className="text-zinc-500">No results for "{query}"</p>
              </div>
            ) : results.map(p => (
              <button key={p.id} onClick={() => { onNavigate("PRODUCT", p); onClose(); }}
                className="flex items-center gap-4 w-full p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors text-left">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0" style={{background:`radial-gradient(ellipse,${p.colors[0]}22,#111)`}}>
                  {CATEGORIES.find(c => c.name === p.category)?.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold">{p.name}</p>
                  <p className="text-zinc-500 text-xs">{p.category}</p>
                </div>
                <span className="text-white text-sm font-bold flex-shrink-0">{fmt(p.price)}</span>
              </button>
            ))}
          </div>
        )}

        {!query && (
          <div>
            <p className="text-zinc-600 text-xs uppercase tracking-widest mb-4">Popular searches</p>
            <div className="flex flex-wrap gap-2">
              {["Hoodies","Jeans","Sneakers","Watches","Caps","Boxers"].map(t => (
                <button key={t} onClick={() => setQuery(t)} className="px-4 py-2 border border-zinc-800 rounded-full text-zinc-400 text-sm hover:border-zinc-600 hover:text-white transition-colors">
                  {t}
                </button>
              ))}
            </div>
            <p className="text-zinc-600 text-xs uppercase tracking-widest mt-8 mb-4">Categories</p>
            <div className="grid grid-cols-4 gap-3">
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => { onNavigate(c.name.toUpperCase()); onClose(); }}
                  className="flex flex-col items-center gap-2 p-3 bg-zinc-900 rounded-xl hover:bg-zinc-800 transition-colors">
                  <span className="text-2xl">{c.icon}</span>
                  <span className="text-zinc-400 text-xs">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── MobileBottomNav ───────────────────────────────────────
export function MobileBottomNav({ onNavigate, currentPage, setSearchOpen }) {
  const { cartCount, wishlist } = useApp();
  const tabs = [
    { id: "HOME", label: "Home", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg> },
    { id: "SEARCH", label: "Search", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>, action: () => setSearchOpen(true) },
    { id: "COLLECTION", label: "Shop", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg> },
    { id: "WISHLIST", label: "Saved", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>, badge: wishlist.length },
    { id: "ACCOUNT", label: "Account", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-950/98 backdrop-blur-xl border-t border-zinc-800 z-30 safe-area-pb">
      <div className="flex items-center justify-around py-2 px-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={tab.action ? tab.action : () => onNavigate(tab.id)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl relative transition-colors ${currentPage === tab.id ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
            {tab.icon}
            <span className="text-[9px] tracking-wider font-medium">{tab.label.toUpperCase()}</span>
            {tab.badge > 0 && <span className="absolute top-0.5 right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white font-bold">{tab.badge}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────
export function Footer({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) { setSubmitted(true); setEmail(""); }
  };

  return (
    <footer className="bg-black border-t border-zinc-900">
      {/* Newsletter */}
      <div className="bg-zinc-900 border-b border-zinc-800 py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-xs text-zinc-500 tracking-widest uppercase mb-3">Exclusive access</div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">
            GET 15% OFF YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-500">FIRST ORDER</span>
          </h2>
          <p className="text-zinc-400 text-sm mb-8">Join the DRØP community. Early access to new drops, exclusive deals, no spam.</p>
          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              You're in! Check your email for your discount code.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="your@email.com"
                className="flex-1 bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:border-zinc-400 transition-colors"/>
              <button type="submit" className="bg-white text-black px-6 py-3.5 rounded-xl font-bold text-sm tracking-wider hover:bg-zinc-100 transition-colors whitespace-nowrap">
                JOIN DRØP
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <button onClick={() => onNavigate("HOME")} className="text-white font-black text-2xl tracking-widest">DRØP</button>
            <p className="text-zinc-500 text-sm mt-3 leading-relaxed">Premium streetwear. Limited drops. No compromises.</p>
            <div className="flex gap-3 mt-5">
              {["IG","TW","TK","YT"].map(s => (
                <a key={s} href="#" className="w-9 h-9 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-zinc-600 transition-all text-xs font-bold">{s}</a>
              ))}
            </div>
          </div>
          {[
            { title: "SHOP", links: [["New Arrivals","COLLECTION"],["Best Sellers","COLLECTION"],["Tops","TOPS"],["Jeans","JEANS"],["Shoes","SHOES"],["Accessories","COLLECTION"]] },
            { title: "HELP", links: [["Size Guide","SIZEGUIDE"],["Shipping Info","FAQ"],["Returns","FAQ"],["Track Order","ACCOUNT"],["FAQ","FAQ"]] },
            { title: "BRAND", links: [["About DRØP","ABOUT"],["Lookbook","LOOKBOOK"],["Contact","CONTACT"]] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white text-xs font-bold tracking-widest mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, page]) => (
                  <li key={label}><button onClick={() => onNavigate(page)} className="text-zinc-500 text-sm hover:text-white transition-colors text-left">{label}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-zinc-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-600 text-xs">© 2025 DRØP. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy","Terms","Cookies"].map(l => (
              <button key={l} onClick={() => onNavigate(l.toUpperCase())} className="text-zinc-600 text-xs hover:text-zinc-400 transition-colors">{l}</button>
            ))}
          </div>
          <div className="flex gap-2">
            {["💳","🏦","📱"].map((icon, i) => (
              <div key={i} className="w-10 h-6 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center text-xs">{icon}</div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── ProductCard ───────────────────────────────────────────
export function ProductCard({ product, onNavigate, compact = false }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const [colorIdx, setColorIdx] = useState(0);
  const [added, setAdded] = useState(false);
  const wished = isWishlisted(product.id);

  const badgeColors = { "New":"bg-emerald-500","Sale":"bg-red-500","Limited":"bg-purple-500","🔥 Hot":"bg-orange-500" };
  const catIcon = CATEGORIES.find(c => c.name === product.category)?.icon;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[colorIdx]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-300 cursor-pointer"
      onClick={() => onNavigate("PRODUCT", product)}>
      <div className="relative aspect-[3/4] overflow-hidden">
        <div className="w-full h-full transition-transform duration-500 group-hover:scale-105"
          style={{background:`radial-gradient(ellipse at 60% 30%, ${product.colors[colorIdx]}44, #0a0a0a)`}}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`opacity-30 group-hover:opacity-50 transition-opacity duration-300 ${compact ? "text-5xl" : "text-7xl"}`}>{catIcon}</span>
          </div>
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 40px,#fff 40px,#fff 41px),repeating-linear-gradient(90deg,transparent,transparent 40px,#fff 40px,#fff 41px)"}}/>
        </div>
        {product.badge && <span className={`absolute top-3 left-3 ${badgeColors[product.badge] || "bg-zinc-600"} text-white text-[10px] font-semibold px-2 py-1 rounded-full`}>{product.badge}</span>}
        {product.stock <= 5 && <span className="absolute top-3 left-3 mt-6 bg-red-500/80 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">Only {product.stock} left</span>}
        <button onClick={e => { e.stopPropagation(); toggleWishlist(product); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-zinc-700 hover:border-zinc-400 transition-all">
          <svg className={`w-4 h-4 transition-colors ${wished ? "text-red-400" : "text-zinc-400"}`} fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button onClick={handleQuickAdd}
            className={`w-full py-3 text-sm font-bold tracking-wider transition-all duration-300 ${added ? "bg-emerald-500 text-white" : "bg-white text-black"}`}>
            {added ? "✓ ADDED" : "QUICK ADD"}
          </button>
        </div>
      </div>
      <div className={compact ? "p-3" : "p-4"}>
        <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{product.category}</div>
        <div className="text-white font-semibold text-sm mb-2 leading-snug">{product.name}</div>
        <div className="flex gap-1.5 mb-3">
          {product.colors.map((c, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setColorIdx(i); }}
              className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${colorIdx === i ? "border-white scale-110" : "border-zinc-700"}`}
              style={{background:c}}/>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-sm">{fmt(product.price)}</span>
            {product.oldPrice && <span className="text-zinc-500 text-xs line-through">{fmt(product.oldPrice)}</span>}
          </div>
          <div className="flex items-center gap-1">
            <Stars rating={product.rating}/>
            <span className="text-zinc-600 text-[10px]">({product.reviews})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
