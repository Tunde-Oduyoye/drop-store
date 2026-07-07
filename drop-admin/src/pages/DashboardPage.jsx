import { useState, useEffect } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { api } from "../lib/api";
import { DashboardSkeleton } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";

const fmt = (n) => `₦${Number(n).toLocaleString()}`;
const fmtShort = (n) => n >= 1000000 ? `₦${(n/1000000).toFixed(1)}M` : n >= 1000 ? `₦${(n/1000).toFixed(0)}K` : `₦${n}`;

const STATUS_CONFIG = {
  PROCESSING: { color: "#F59E0B", label: "Processing" },
  SHIPPED:    { color: "#60A5FA", label: "Shipped" },
  DELIVERED:  { color: "#CCFF00", label: "Delivered" },
  CANCELLED:  { color: "#F87171", label: "Cancelled" },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1C1C1F] border border-white/10 rounded-xl px-3 py-2.5 shadow-xl">
      <p className="text-zinc-500 text-[11px] font-mono mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-white text-[13px] font-bold font-mono">{fmtShort(p.value)}</p>
      ))}
    </div>
  );
};

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1C1C1F] border border-white/10 rounded-xl px-3 py-2.5 shadow-xl">
      <p className="text-zinc-500 text-[11px] font-mono mb-1">{label}</p>
      <p className="text-white text-[13px] font-bold font-mono">{payload[0]?.value} orders</p>
    </div>
  );
};

export default function DashboardPage({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.orders.stats(), api.orders.listAll()])
      .then(([s, o]) => { setStats(s); setRecentOrders(o.orders || []); })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton/>;
  if (error) return (
    <div className="p-8">
      <EmptyState icon="⚠️" title="Failed to load dashboard" description={error} action="Retry" onAction={() => window.location.reload()}/>
    </div>
  );

  // Build 7-day revenue data
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayOrders = recentOrders.filter(o => new Date(o.createdAt).toDateString() === d.toDateString());
    return {
      day: d.toLocaleDateString("en-NG", { weekday: "short" }),
      revenue: dayOrders.reduce((s, o) => s + o.total, 0),
      orders: dayOrders.length,
    };
  });

  // Order status donut data
  const statusData = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
    name: cfg.label,
    value: recentOrders.filter(o => o.status === key).length,
    color: cfg.color,
  })).filter(s => s.value > 0);

  const kpis = [
    { label: "Total Revenue", value: fmtShort(stats.totalRevenue), sub: "from paid orders", accent: true },
    { label: "Total Orders", value: stats.totalOrders, sub: `${stats.todayOrders} today` },
    { label: "Processing", value: stats.pendingOrders, sub: "need action", warn: stats.pendingOrders > 0 },
    { label: "Products", value: stats.totalProducts, sub: "in catalog" },
    { label: "Customers", value: stats.totalUsers, sub: "registered" },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-[1400px] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-[22px] font-bold tracking-tight">Overview</h1>
          <p className="text-zinc-600 text-[13px] mt-0.5 font-mono">
            {new Date().toLocaleDateString("en-NG", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
          </p>
        </div>
        <button onClick={() => { setLoading(true); setError(""); Promise.all([api.orders.stats(), api.orders.listAll()]).then(([s,o]) => { setStats(s); setRecentOrders(o.orders||[]); }).catch(e => setError(e.message)).finally(() => setLoading(false)); }}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-[12px] font-medium border border-white/[0.06] px-3 py-1.5 rounded-lg hover:border-white/20 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {kpis.map(k => (
          <div key={k.label} className={`rounded-2xl p-4 border flex flex-col gap-2 ${k.accent ? "bg-lime-400/[0.05] border-lime-400/20" : "bg-[#0E0E10] border-white/[0.06]"}`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-semibold tracking-wider uppercase ${k.accent ? "text-lime-400/60" : "text-zinc-600"}`}>{k.label}</span>
              {k.warn && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse_dot flex-shrink-0"/>}
            </div>
            <div className={`text-[28px] font-black font-mono tracking-tight leading-none ${k.accent ? "text-lime-400" : "text-white"}`}>{k.value}</div>
            <p className={`text-[11px] ${k.warn ? "text-amber-400/70" : "text-zinc-600"}`}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue area chart */}
        <div className="lg:col-span-2 bg-[#0E0E10] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-semibold text-[14px]">Revenue — last 7 days</h2>
              <p className="text-zinc-600 text-[11px] font-mono mt-0.5">Total: {fmtShort(stats.totalRevenue)}</p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-600">
              <span className="w-2 h-2 rounded-full bg-lime-400"/>
              Revenue
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={last7} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#CCFF00" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#CCFF00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false}/>
              <XAxis dataKey="day" tick={{ fill: "#52525b", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill: "#52525b", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => v > 0 ? fmtShort(v) : ""}/>
              <Tooltip content={<CustomTooltip/>} cursor={{ stroke: "#ffffff10", strokeWidth: 1 }}/>
              <Area type="monotone" dataKey="revenue" stroke="#CCFF00" strokeWidth={2} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 4, fill: "#CCFF00", stroke: "#0E0E10", strokeWidth: 2 }}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Order status donut */}
        <div className="bg-[#0E0E10] border border-white/[0.06] rounded-2xl p-5">
          <h2 className="text-white font-semibold text-[14px] mb-5">Order status</h2>
          {statusData.length === 0 ? (
            <EmptyState icon="📦" title="No orders yet" description="Order status breakdown will appear here"/>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {statusData.map((entry, i) => <Cell key={i} fill={entry.color}/>)}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value + " orders", name]} contentStyle={{ background: "#1C1C1F", border: "1px solid #ffffff1a", borderRadius: 12, fontSize: 12 }}/>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {statusData.map(s => (
                  <div key={s.name} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.color }}/>
                    <span className="text-zinc-400 text-[12px] flex-1">{s.name}</span>
                    <span className="text-white font-mono text-[12px] font-semibold">{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Orders per day bar chart */}
      <div className="bg-[#0E0E10] border border-white/[0.06] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-semibold text-[14px]">Orders per day</h2>
            <p className="text-zinc-600 text-[11px] font-mono mt-0.5">Last 7 days</p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-600">
            <span className="w-2 h-2 rounded-full bg-blue-400"/>
            Orders
          </div>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={last7} margin={{ top: 0, right: 5, left: -20, bottom: 0 }} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false}/>
            <XAxis dataKey="day" tick={{ fill: "#52525b", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill: "#52525b", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} allowDecimals={false}/>
            <Tooltip content={<CustomBarTooltip/>} cursor={{ fill: "#ffffff05" }}/>
            <Bar dataKey="orders" fill="#60A5FA" radius={[4,4,0,0]} fillOpacity={0.8}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent orders */}
        <div className="lg:col-span-2 bg-[#0E0E10] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <h2 className="text-white font-semibold text-[14px]">Recent orders</h2>
            <button onClick={() => onNavigate("ORDERS")} className="text-zinc-500 hover:text-lime-400 text-[12px] font-medium transition-colors">See all →</button>
          </div>
          {recentOrders.length === 0 ? (
            <EmptyState icon="🛒" title="No orders yet" description="Your first customer order will appear here in real time"/>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {recentOrders.slice(0,6).map(order => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PROCESSING;
                return (
                  <div key={order.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[12px] font-black text-zinc-400 flex-shrink-0">
                      {order.user?.name?.[0]?.toUpperCase() || "G"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-[13px] font-medium truncate">{order.user?.name || "Guest"} <span className="text-zinc-700 font-mono text-[11px]">{order.orderNumber}</span></p>
                      <p className="text-zinc-600 text-[11px] mt-0.5">{order.items?.length} item{order.items?.length !== 1?"s":""} · {new Date(order.createdAt).toLocaleDateString("en-NG",{day:"numeric",month:"short"})}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-white font-mono text-[13px] font-semibold">{fmt(order.total)}</span>
                      <span className="w-2 h-2 rounded-full" style={{background:cfg.color}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Low stock */}
          <div className="bg-[#0E0E10] border border-white/[0.06] rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h2 className="text-white font-semibold text-[14px]">Stock alerts</h2>
              {stats.lowStockProducts.length > 0 && (
                <span className="text-[10px] font-mono bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded-full">{stats.lowStockProducts.length}</span>
              )}
            </div>
            {stats.lowStockProducts.length === 0 ? (
              <div className="px-5 py-6 text-center text-zinc-600 text-[13px]">
                <span className="text-lime-400 mr-1.5">✓</span>All products well stocked
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {stats.lowStockProducts.slice(0,5).map(p => (
                  <div key={p.id} className="flex items-center justify-between px-5 py-3">
                    <span className="text-zinc-300 text-[13px] truncate flex-1">{p.name}</span>
                    <span className={`font-mono text-[12px] font-semibold ml-3 ${p.stock<=2?"text-red-400":"text-amber-400"}`}>{p.stock} left</span>
                  </div>
                ))}
              </div>
            )}
            {stats.lowStockProducts.length > 0 && (
              <button onClick={() => onNavigate("PRODUCTS")} className="w-full text-center text-zinc-500 hover:text-lime-400 text-[12px] font-medium py-3 border-t border-white/[0.06] transition-colors">Update inventory →</button>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-[#0E0E10] border border-white/[0.06] rounded-2xl p-4">
            <p className="text-zinc-600 text-[10px] font-semibold tracking-widest uppercase mb-3">Quick actions</p>
            <div className="space-y-1">
              {[
                {label:"Add new product", icon:"＋", page:"PRODUCTS"},
                {label:"View all orders", icon:"→", page:"ORDERS"},
                {label:"Store settings", icon:"⚙", page:"SETTINGS"},
              ].map(a => (
                <button key={a.label} onClick={() => onNavigate(a.page)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-400 hover:bg-white/[0.04] hover:text-white text-[13px] transition-colors text-left">
                  <span className="text-zinc-600 font-mono w-4 text-center text-[13px]">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
