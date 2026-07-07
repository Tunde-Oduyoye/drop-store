import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { useAdmin } from "../context/AdminContext";

const fmt = (n) => `₦${Number(n).toLocaleString()}`;
const STATUSES = ["PROCESSING","SHIPPED","DELIVERED","CANCELLED"];

const STATUS_CONFIG = {
  PROCESSING: { color: "bg-amber-400/10 text-amber-400 border-amber-400/20", dot: "bg-amber-400", label: "Processing" },
  SHIPPED:    { color: "bg-blue-400/10 text-blue-400 border-blue-400/20",   dot: "bg-blue-400",  label: "Shipped" },
  DELIVERED:  { color: "bg-lime-400/10 text-lime-400 border-lime-400/20",   dot: "bg-lime-400",  label: "Delivered" },
  CANCELLED:  { color: "bg-red-400/10 text-red-400 border-red-400/20",     dot: "bg-red-400",   label: "Cancelled" },
};

export default function OrdersPage() {
  const { showToast } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    api.orders.listAll(filter)
      .then(({ orders }) => setOrders(orders))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.orders.updateStatus(id, status);
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      showToast(`Order marked as ${status.toLowerCase()}`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  return (
    <div className="p-6 sm:p-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-[22px] font-bold tracking-tight">Orders</h1>
          <p className="text-zinc-600 text-[13px] mt-0.5 font-mono">{orders.length} total orders</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <button onClick={() => setFilter("")}
          className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-colors border ${!filter ? "border-lime-400/30 bg-lime-400/10 text-lime-400" : "border-white/[0.06] bg-white/[0.02] text-zinc-500 hover:text-zinc-300"}`}>
          All <span className="font-mono ml-1 opacity-60">{orders.length}</span>
        </button>
        {STATUSES.map(s => {
          const cfg = STATUS_CONFIG[s];
          const active = filter === s;
          return (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-colors border flex items-center gap-1.5 ${active ? cfg.color + " border-current/20" : "border-white/[0.06] bg-white/[0.02] text-zinc-500 hover:text-zinc-300"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${active ? cfg.dot : "bg-zinc-600"}`}/>
              {cfg.label}
              <span className="font-mono opacity-60">{counts[s]}</span>
            </button>
          );
        })}

        <div className="ml-auto relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..."
            className="bg-[#0E0E10] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2 text-white text-[13px] placeholder-zinc-700 focus:outline-none focus:border-white/20 w-52 transition-colors"/>
        </div>
      </div>

      {error && <div className="bg-red-500/[0.08] border border-red-500/20 text-red-400 text-[13px] rounded-xl px-4 py-3 mb-5">{error}</div>}

      {/* Orders table */}
      <div className="bg-[#0E0E10] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] min-w-[800px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Order","Customer","Date","Items","Total","Status",""].map(h => (
                  <th key={h} className={`py-3 px-5 text-[10px] font-semibold tracking-widest uppercase text-zinc-600 ${h === "" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr><td colSpan={7} className="py-16 text-center text-zinc-600 font-mono text-xs">LOADING ORDERS</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-16 text-center text-zinc-600 text-sm">No orders found</td></tr>
              ) : filtered.map(order => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PROCESSING;
                const isExpanded = expandedId === order.id;
                return (
                  <>
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors cursor-pointer group" onClick={() => setExpandedId(isExpanded ? null : order.id)}>
                      <td className="py-3.5 px-5">
                        <p className="text-white font-mono font-semibold text-[12px]">{order.orderNumber}</p>
                        <p className="text-zinc-600 text-[11px] mt-0.5 font-mono">{order.paymentMethod}</p>
                      </td>
                      <td className="py-3.5 px-5">
                        <p className="text-zinc-200 font-medium truncate max-w-[150px]">{order.user?.name || "Guest"}</p>
                        <p className="text-zinc-600 text-[11px] truncate max-w-[150px] mt-0.5">{order.user?.email}</p>
                      </td>
                      <td className="py-3.5 px-5 text-zinc-500 font-mono text-[12px] whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="py-3.5 px-5 text-zinc-400 font-mono">{order.items.length}</td>
                      <td className="py-3.5 px-5 text-white font-mono font-semibold">{fmt(order.total)}</td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}/>
                          {cfg.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <svg className={`w-4 h-4 text-zinc-600 ml-auto transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr key={`${order.id}-expanded`} className="bg-white/[0.01]">
                        <td colSpan={7} className="px-5 pb-4 pt-0">
                          <div className="pt-3 border-t border-white/[0.04] grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Items */}
                            <div>
                              <p className="text-zinc-600 text-[10px] font-semibold tracking-widest uppercase mb-2.5">Items ordered</p>
                              <div className="space-y-2">
                                {order.items.map(item => (
                                  <div key={item.id} className="flex items-center gap-3 bg-white/[0.02] rounded-xl px-3 py-2.5">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-zinc-200 text-[13px] font-medium truncate">{item.name}</p>
                                      <p className="text-zinc-600 text-[11px] font-mono mt-0.5">Size: {item.size} · Color: {item.color} · Qty: {item.qty}</p>
                                    </div>
                                    <span className="text-white font-mono text-[12px] font-semibold flex-shrink-0">{fmt(item.price * item.qty)}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Details + Status update */}
                            <div className="space-y-4">
                              <div>
                                <p className="text-zinc-600 text-[10px] font-semibold tracking-widest uppercase mb-2.5">Delivery details</p>
                                <div className="bg-white/[0.02] rounded-xl px-3 py-3 space-y-1.5 text-[13px]">
                                  <div className="flex gap-2"><span className="text-zinc-600 w-20">Address</span><span className="text-zinc-200">{order.deliveryAddress}</span></div>
                                  <div className="flex gap-2"><span className="text-zinc-600 w-20">Phone</span><span className="text-zinc-200 font-mono">{order.phone}</span></div>
                                  <div className="flex gap-2"><span className="text-zinc-600 w-20">Shipping</span><span className={order.shipping === 0 ? "text-lime-400" : "text-zinc-200"}>{order.shipping === 0 ? "FREE" : fmt(order.shipping)}</span></div>
                                  {order.discount > 0 && <div className="flex gap-2"><span className="text-zinc-600 w-20">Discount</span><span className="text-emerald-400">−{fmt(order.discount)}</span></div>}
                                </div>
                              </div>
                              <div>
                                <p className="text-zinc-600 text-[10px] font-semibold tracking-widest uppercase mb-2.5">Update status</p>
                                <div className="flex flex-wrap gap-2">
                                  {STATUSES.map(s => {
                                    const sCfg = STATUS_CONFIG[s];
                                    const isActive = order.status === s;
                                    const isUpdating = updatingId === order.id;
                                    return (
                                      <button key={s} onClick={(e) => { e.stopPropagation(); if (!isActive) handleStatusChange(order.id, s); }}
                                        disabled={isActive || isUpdating}
                                        className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all disabled:cursor-default ${isActive ? sCfg.color : "border-white/[0.06] text-zinc-500 hover:border-white/20 hover:text-zinc-300"}`}>
                                        {isUpdating && !isActive ? "..." : sCfg.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
