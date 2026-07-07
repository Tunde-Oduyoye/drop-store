import { useState } from "react";
import { useAdmin } from "../context/AdminContext";

function Section({ title, description, children, danger = false }) {
  return (
    <div className={`bg-[#0E0E10] border rounded-2xl overflow-hidden ${danger ? "border-red-500/20" : "border-white/[0.06]"}`}>
      <div className={`px-6 py-5 border-b ${danger ? "border-red-500/10" : "border-white/[0.06]"}`}>
        <h2 className={`font-semibold text-[14px] ${danger ? "text-red-400" : "text-white"}`}>{title}</h2>
        {description && <p className="text-zinc-600 text-[12px] mt-0.5">{description}</p>}
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Toggle({ label, description, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-white text-[13px] font-medium">{label}</p>
        {description && <p className="text-zinc-600 text-[12px] mt-0.5">{description}</p>}
      </div>
      <button onClick={() => onChange(!enabled)}
        className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${enabled ? "bg-lime-400" : "bg-white/[0.08]"}`}
        style={{ height: 22, width: 40 }}>
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"}`}/>
      </button>
    </div>
  );
}

function StatusMsg({ success, error }) {
  if (!success && !error) return null;
  return (
    <div className={`flex items-center gap-2 text-[13px] rounded-xl px-3.5 py-2.5 border ${success ? "bg-lime-400/[0.06] border-lime-400/20 text-lime-400" : "bg-red-500/[0.08] border-red-500/20 text-red-400"}`}>
      {success ? "✓" : "⚠"} {success || error}
    </div>
  );
}

export default function SettingsPage() {
  const { user, showToast } = useAdmin();

  // Store config state
  const [store, setStore] = useState({
    name: "DRØP",
    email: "support@drop.ng",
    phone: "+234 800 000 0000",
    currency: "NGN",
    freeShippingThreshold: "30000",
    shippingFee: "2500",
    paystackMode: "test",
  });

  // Notification toggles
  const [notifications, setNotifications] = useState({
    newOrder: true,
    lowStock: true,
    newCustomer: false,
    paymentFailed: true,
  });

  // Admin password state
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwStatus, setPwStatus] = useState({ success: "", error: "" });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwStatus({ success: "", error: "" });
    if (passwords.new !== passwords.confirm) { setPwStatus({ success: "", error: "New passwords don't match" }); return; }
    if (passwords.new.length < 6) { setPwStatus({ success: "", error: "New password must be at least 6 characters" }); return; }
    setPwLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/password", {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.new }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPasswords({ current: "", new: "", confirm: "" });
      setPwStatus({ success: "Password changed successfully", error: "" });
      showToast("Password updated");
    } catch (err) {
      setPwStatus({ success: "", error: err.message });
    } finally {
      setPwLoading(false);
    }
  };

  const integrations = [
    { name: "Supabase PostgreSQL", desc: "Primary database", status: "Connected", color: "text-lime-400 bg-lime-400/10 border-lime-400/20" },
    { name: "Cloudinary", desc: "Product image CDN", status: "Configure in .env", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
    { name: "Paystack", desc: `Payments — ${store.paystackMode} mode`, status: store.paystackMode === "live" ? "Live" : "Test mode", color: store.paystackMode === "live" ? "text-lime-400 bg-lime-400/10 border-lime-400/20" : "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-[900px] space-y-5">
      <div>
        <h1 className="text-white text-[22px] font-bold tracking-tight">Store Settings</h1>
        <p className="text-zinc-600 text-[13px] mt-0.5">Configure your DRØP store and admin account</p>
      </div>

      {/* Store info */}
      <Section title="Store information" description="Basic details about your store">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Store name", key: "name", placeholder: "DRØP" },
              { label: "Support email", key: "email", placeholder: "support@drop.ng" },
              { label: "Support phone", key: "phone", placeholder: "+234 800 000 0000" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[11px] text-zinc-500 font-semibold tracking-wider uppercase block mb-1.5">{f.label}</label>
                <input value={store[f.key]} onChange={e => setStore(s => ({...s, [f.key]: e.target.value}))} placeholder={f.placeholder}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-white text-[13.5px] placeholder-zinc-700 focus:outline-none focus:border-lime-400/40 transition-colors"/>
              </div>
            ))}
            <div>
              <label className="text-[11px] text-zinc-500 font-semibold tracking-wider uppercase block mb-1.5">Currency</label>
              <select value={store.currency} onChange={e => setStore(s => ({...s, currency: e.target.value}))}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-white text-[13.5px] focus:outline-none focus:border-lime-400/40 transition-colors">
                <option value="NGN">NGN — Nigerian Naira (₦)</option>
                <option value="USD">USD — US Dollar ($)</option>
                <option value="GBP">GBP — British Pound (£)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={() => showToast("Store info saved")}
              className="flex items-center gap-2 bg-lime-400 text-black px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-lime-500 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              Save changes
            </button>
          </div>
        </div>
      </Section>

      {/* Shipping */}
      <Section title="Shipping configuration" description="Delivery fees and free shipping rules">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {[
            { label: "Free shipping above (₦)", key: "freeShippingThreshold", placeholder: "30000" },
            { label: "Standard shipping fee (₦)", key: "shippingFee", placeholder: "2500" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-[11px] text-zinc-500 font-semibold tracking-wider uppercase block mb-1.5">{f.label}</label>
              <input type="number" value={store[f.key]} onChange={e => setStore(s => ({...s, [f.key]: e.target.value}))} placeholder={f.placeholder}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-white text-[13.5px] placeholder-zinc-700 focus:outline-none focus:border-lime-400/40 transition-colors font-mono"/>
            </div>
          ))}
        </div>
        <div className="bg-white/[0.02] rounded-xl p-3 text-zinc-600 text-[12px]">
          Current rule: Orders above <span className="text-zinc-300 font-mono">₦{Number(store.freeShippingThreshold).toLocaleString()}</span> get free delivery. Others pay <span className="text-zinc-300 font-mono">₦{Number(store.shippingFee).toLocaleString()}</span>.
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={() => showToast("Shipping settings saved")}
            className="flex items-center gap-2 bg-lime-400 text-black px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-lime-500 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            Save changes
          </button>
        </div>
      </Section>

      {/* Payment mode */}
      <Section title="Payment settings" description="Switch between Paystack test and live mode">
        <div className="flex gap-3 mb-4">
          {["test","live"].map(mode => (
            <button key={mode} onClick={() => setStore(s => ({...s, paystackMode: mode}))}
              className={`flex-1 py-3 rounded-xl border text-[13px] font-semibold capitalize transition-all ${store.paystackMode === mode ? mode === "live" ? "border-lime-400/30 bg-lime-400/10 text-lime-400" : "border-blue-400/30 bg-blue-400/10 text-blue-400" : "border-white/[0.06] text-zinc-500 hover:border-white/20"}`}>
              {mode === "live" ? "🔴 Live mode" : "🔵 Test mode"}
            </button>
          ))}
        </div>
        <div className={`rounded-xl px-4 py-3 text-[12px] ${store.paystackMode === "live" ? "bg-lime-400/[0.05] border border-lime-400/20 text-lime-400/80" : "bg-blue-400/[0.05] border border-blue-400/20 text-blue-400/80"}`}>
          {store.paystackMode === "live"
            ? "⚠️ Live mode is active — real cards will be charged. Make sure you've switched to live API keys in your .env file."
            : "🔵 Test mode is active — use Paystack test cards. No real charges will be made."}
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" description="Choose which events trigger admin alerts">
        <div>
          <Toggle label="New order placed" description="Alert when a customer places a new order" enabled={notifications.newOrder} onChange={v => setNotifications(n => ({...n, newOrder: v}))}/>
          <Toggle label="Low stock warning" description="Alert when a product has 5 or fewer items left" enabled={notifications.lowStock} onChange={v => setNotifications(n => ({...n, lowStock: v}))}/>
          <Toggle label="New customer signup" description="Alert when a new account is created" enabled={notifications.newCustomer} onChange={v => setNotifications(n => ({...n, newCustomer: v}))}/>
          <Toggle label="Payment failed" description="Alert when a customer payment fails or is declined" enabled={notifications.paymentFailed} onChange={v => setNotifications(n => ({...n, paymentFailed: v}))}/>
        </div>
        <div className="mt-4 text-zinc-600 text-[12px]">Email notifications will be sent to <span className="text-zinc-400">{user.email}</span></div>
      </Section>

      {/* Integrations */}
      <Section title="Integrations" description="Third-party services connected to your store">
        <div className="space-y-1">
          {integrations.map(s => (
            <div key={s.name} className="flex items-center justify-between py-3.5 border-b border-white/[0.04] last:border-0">
              <div>
                <p className="text-white text-[13px] font-semibold">{s.name}</p>
                <p className="text-zinc-600 text-[12px] mt-0.5">{s.desc}</p>
              </div>
              <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${s.color}`}>{s.status}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Admin password */}
      <Section title="Admin password" description="Change your admin account password">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {["current","new","confirm"].map(field => (
            <div key={field}>
              <label className="text-[11px] text-zinc-500 font-semibold tracking-wider uppercase block mb-1.5">
                {field === "current" ? "Current password" : field === "new" ? "New password" : "Confirm new password"}
              </label>
              <div className="relative">
                <input type={showPw[field] ? "text" : "password"} value={passwords[field]} onChange={e => setPasswords(p => ({...p, [field]: e.target.value}))}
                  placeholder="••••••••" required
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-white text-[13.5px] placeholder-zinc-700 focus:outline-none focus:border-lime-400/40 transition-colors pr-16"/>
                <button type="button" onClick={() => setShowPw(p => ({...p, [field]: !p[field]}))}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 text-[10px] font-semibold tracking-wider">
                  {showPw[field] ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>
          ))}
          {passwords.new.length > 0 && (
            <div>
              <div className="flex gap-1 mb-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${passwords.new.length >= i*3 ? i<=1?"bg-red-400":i<=2?"bg-amber-400":i<=3?"bg-blue-400":"bg-lime-400" : "bg-white/[0.06]"}`}/>
                ))}
              </div>
              <p className="text-zinc-600 text-[11px]">{passwords.new.length<6?"Too short":passwords.new.length<9?"Fair":passwords.new.length<12?"Good":"Strong"}</p>
            </div>
          )}
          {(pwStatus.success || pwStatus.error) && <StatusMsg success={pwStatus.success} error={pwStatus.error}/>}
          <div className="flex justify-end">
            <button type="submit" disabled={pwLoading}
              className="flex items-center gap-2 bg-lime-400 text-black px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-lime-500 transition-colors disabled:opacity-50">
              {pwLoading ? "Changing..." : "Change password"}
            </button>
          </div>
        </form>
      </Section>

      {/* System info */}
      <Section title="System information">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            {label:"Version", value:"v1.0.0"},
            {label:"Environment", value:"Development"},
            {label:"Backend", value:"localhost:5000"},
            {label:"Database", value:"Supabase"},
            {label:"Admin", value:user.name},
            {label:"Admin ID", value:user.id?.slice(0,8)+"..."},
          ].map(item => (
            <div key={item.label} className="bg-white/[0.02] rounded-xl px-4 py-3">
              <p className="text-zinc-600 text-[10px] font-semibold tracking-wider uppercase mb-1">{item.label}</p>
              <p className="text-white text-[13px] font-mono truncate">{item.value}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Danger zone */}
      <Section title="Danger zone" description="Irreversible actions — proceed with extreme caution" danger>
        <div className="space-y-1">
          {[
            {label:"Export all orders", desc:"Download complete order history as CSV", btn:"Export CSV", btnColor:"border-white/[0.08] text-zinc-400 hover:border-white/20 hover:text-zinc-200"},
            {label:"Export customer list", desc:"Download all customer data as CSV", btn:"Export CSV", btnColor:"border-white/[0.08] text-zinc-400 hover:border-white/20 hover:text-zinc-200"},
            {label:"Clear all sessions", desc:"Log out all active admin sessions immediately", btn:"Sign out all", btnColor:"border-amber-500/30 text-amber-400 hover:bg-amber-500/10"},
          ].map(a => (
            <div key={a.label} className="flex items-center justify-between py-3.5 border-b border-white/[0.04] last:border-0">
              <div>
                <p className="text-white text-[13px] font-semibold">{a.label}</p>
                <p className="text-zinc-600 text-[12px] mt-0.5">{a.desc}</p>
              </div>
              <button onClick={() => showToast(`${a.label} — coming soon`, "info")}
                className={`border px-4 py-2 rounded-xl text-[12px] font-semibold transition-colors ml-4 flex-shrink-0 ${a.btnColor}`}>
                {a.btn}
              </button>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
