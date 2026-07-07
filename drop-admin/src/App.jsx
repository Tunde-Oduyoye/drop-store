import { useState, useEffect, useCallback } from "react";
import { AdminProvider, useAdmin } from "./context/AdminContext";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import CommandPalette from "./components/CommandPalette";
import Toast from "./components/Toast";
import SettingsPage from "./pages/SettingsPage";

const NAV = [
  { id: "DASHBOARD", label: "Dashboard", icon: (a) => (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={a?2:1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/></svg>
  )},
  { id: "PRODUCTS", label: "Products", icon: (a) => (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={a?2:1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"/></svg>
  )},
  { id: "ORDERS", label: "Orders", icon: (a) => (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={a?2:1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25a2 2 0 01-2 2H5.75a2 2 0 01-2-2V5.75a2 2 0 012-2h4.25M16.5 3.75h4.5v4.5M21 3.75l-9 9"/></svg>
  )},
  { id: "SETTINGS", label: "Settings", icon: (a) => (
    <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={a?2:1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
  )},
];

function Shell() {
  const { user, logout } = useAdmin();
  const [page, setPage] = useState("DASHBOARD");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const iv = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setPaletteOpen(v => !v);
    }
  }, []);
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const renderPage = () => {
    switch (page) {
      case "PRODUCTS": return <ProductsPage />;
      case "ORDERS": return <OrdersPage />;
      case "SETTINGS": return <SettingsPage />;
      default: return <DashboardPage onNavigate={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex font-sans">
      <div className={`fixed inset-0 bg-black/70 z-40 lg:hidden transition-opacity ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setSidebarOpen(false)}/>

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-[252px] bg-[#0E0E10] border-r border-white/[0.06] z-50 flex flex-col transition-transform duration-200 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="px-5 py-5 border-b border-white/[0.06] flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-lime-400 flex items-center justify-center flex-shrink-0">
            <span className="text-black font-black text-xs">D</span>
          </div>
          <div>
            <div className="text-white font-bold text-[15px] tracking-tight leading-none">DRØP</div>
            <div className="text-zinc-600 text-[10px] tracking-wider mt-0.5 font-mono">CONTROL</div>
          </div>
        </div>

        {/* Search trigger */}
        <div className="px-3 pt-4">
          <button onClick={() => setPaletteOpen(true)} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-zinc-500 text-[13px] hover:border-white/[0.12] hover:text-zinc-400 transition-colors">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <span className="flex-1 text-left">Search...</span>
            <kbd className="text-[10px] font-mono text-zinc-600 bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/[0.06]">⌘K</kbd>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <div className="text-zinc-600 text-[10px] font-semibold tracking-widest uppercase px-3 mb-2">Operations</div>
          {NAV.map(item => {
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => { setPage(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all relative ${active ? "bg-white/[0.06] text-white" : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300"}`}>
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-lime-400 rounded-r-full"/>}
                <span className={active ? "text-lime-400" : ""}>{item.icon(active)}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Live clock / status */}
        <div className="px-5 py-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-600">
            <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse_dot"/>
            <span>{clock.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
            <span className="text-zinc-700">·</span>
            <span>SYSTEM LIVE</span>
          </div>
        </div>

        <div className="px-3 py-3 border-t border-white/[0.06]">
          <div className="flex items-center gap-2.5 px-2 py-1.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.06] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-[13px] font-semibold truncate leading-tight">{user.name}</p>
              <p className="text-zinc-600 text-[11px] truncate leading-tight mt-0.5">{user.email}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-zinc-500 text-[13px] hover:bg-white/[0.03] hover:text-zinc-300 transition-colors">
            <svg className="w-[15px] h-[15px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/></svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0E0E10] sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-zinc-400 p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
          <span className="text-white font-bold tracking-tight text-sm">DRØP CONTROL</span>
          <button onClick={() => setPaletteOpen(true)} className="text-zinc-400 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>
        </div>
        {renderPage()}
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} onNavigate={setPage} />
      <Toast />
    </div>
  );
}

function AppContent() {
  const { user, checking } = useAdmin();

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-600 font-mono text-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse_dot"/>
          INITIALIZING
        </div>
      </div>
    );
  }
  if (!user) return <LoginPage />;
  return <Shell />;
}

export default function App() {
  return (
    <AdminProvider>
      <AppContent />
    </AdminProvider>
  );
}
