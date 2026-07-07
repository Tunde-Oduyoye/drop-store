import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { ProductCard, Stars } from "../components/Shared";
import { fmt, ALL_PRODUCTS, LOOKS, REVIEWS_DATA, CATEGORIES } from "../data/products";
import { api } from "../lib/api";

// ── Login Page ────────────────────────────────────────────
export function LoginPage({ onNavigate }) {
  const { login } = useApp();
  const rememberedEmail = (() => {
    try { return localStorage.getItem("drop_remembered_email") || ""; } catch { return ""; }
  })();
  const [email, setEmail] = useState(rememberedEmail);
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(Boolean(rememberedEmail));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const persistRememberedEmail = () => {
    try {
      if (rememberMe) localStorage.setItem("drop_remembered_email", email);
      else localStorage.removeItem("drop_remembered_email");
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    try {
      await login(email, password, rememberMe);
      persistRememberedEmail();
      onNavigate("ACCOUNT");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setError("");
    try {
      if (email.trim()) localStorage.setItem("drop_password_reset_email", email.trim());
    } catch {}
    onNavigate("FORGOT_PASSWORD");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pb-24 md:pb-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <button onClick={() => onNavigate("HOME")} className="text-white font-black text-3xl tracking-widest mb-6 block mx-auto">DRØP</button>
          <h1 className="text-2xl font-black tracking-tight text-white">Welcome back</h1>
          <p className="text-zinc-500 text-sm mt-2">Sign in to your DRØP account</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 tracking-widest uppercase block mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@email.com"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"/>
            </div>
            <div>
              <label className="text-xs text-zinc-400 tracking-widest uppercase block mb-2">Password</label>
              <div className="relative">
                <input type={showPw?"text":"password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors pr-12"/>
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs">
                  {showPw ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="sr-only"/>
                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? "bg-white border-white" : "border-zinc-600"}`}>
                  {rememberMe && <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
                </div>
                <span className="text-zinc-400 text-sm">Remember me</span>
              </label>
              <button type="button" onClick={handleForgotPassword}
                className="text-zinc-400 text-sm hover:text-white transition-colors">
                Forgot password?
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-white text-black py-4 rounded-xl font-black tracking-wider text-sm hover:bg-zinc-100 transition-colors mt-2 disabled:opacity-50">
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>
          <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800"/></div><div className="relative flex justify-center"><span className="bg-zinc-900 px-4 text-zinc-500 text-xs">or</span></div></div>
          <p className="text-center text-zinc-500 text-sm">Don't have an account?{" "}
            <button onClick={() => onNavigate("REGISTER")} className="text-white font-semibold hover:underline">Create one</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Register Page ─────────────────────────────────────────
export function RegisterPage({ onNavigate }) {
  const { register } = useApp();
  const [form, setForm] = useState({ name:"", email:"", password:"", confirm:"" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm(f => ({...f, [k]: e.target.value}));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields"); return; }
    if (form.password !== form.confirm) { setError("Passwords don't match"); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      onNavigate("ACCOUNT");
    } catch (err) {
      setError(err.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pb-24 md:pb-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <button onClick={() => onNavigate("HOME")} className="text-white font-black text-3xl tracking-widest mb-6 block mx-auto">DRØP</button>
          <h1 className="text-2xl font-black tracking-tight text-white">Create your account</h1>
          <p className="text-zinc-500 text-sm mt-2">Join the DRØP community and get 15% off</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[["name","Full Name","text","Your full name"],["email","Email","email","you@email.com"]].map(([key,label,type,ph]) => (
              <div key={key}>
                <label className="text-xs text-zinc-400 tracking-widest uppercase block mb-2">{label}</label>
                <input type={type} value={form[key]} onChange={set(key)} required placeholder={ph}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"/>
              </div>
            ))}
            {["password","confirm"].map((key) => (
              <div key={key}>
                <label className="text-xs text-zinc-400 tracking-widest uppercase block mb-2">{key==="password"?"Password":"Confirm Password"}</label>
                <div className="relative">
                  <input type={showPw?"text":"password"} value={form[key]} onChange={set(key)} required placeholder="••••••••"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors pr-12"/>
                  {key==="password" && <button type="button" onClick={() => setShowPw(v=>!v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs">{showPw?"HIDE":"SHOW"}</button>}
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="w-full bg-white text-black py-4 rounded-xl font-black tracking-wider text-sm hover:bg-zinc-100 transition-colors mt-2 disabled:opacity-50">
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </form>
          <p className="text-center text-zinc-500 text-xs mt-6">By creating an account you agree to our <button className="text-zinc-400 underline">Terms</button> and <button className="text-zinc-400 underline">Privacy Policy</button></p>
          <p className="text-center text-zinc-500 text-sm mt-4">Already have an account?{" "}
            <button onClick={() => onNavigate("LOGIN")} className="text-white font-semibold hover:underline">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Account Page ──────────────────────────────────────────
function AccountInputField({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="text-xs text-zinc-400 tracking-widest uppercase block mb-2">{label}</label>
      <input type={type} value={value ?? ""} onChange={onChange} placeholder={placeholder}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"/>
    </div>
  );
}

export function AccountPage({ onNavigate }) {
  const { user, logout, orders, wishlist, showToast } = useApp();
  const [activeTab, setActiveTab] = useState("orders");

  // Profile state
  const [profile, setProfile] = useState({ name: user?.name || "", email: user?.email || "", phone: user?.phone ?? "" });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ success: "", error: "" });

  // Password state
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState({ success: "", error: "" });

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ label: "Home", address: "", city: "", state: "" });
  const [addressSaving, setAddressSaving] = useState(false);
  const [preferences, setPreferences] = useState({ "Order updates": true, "New drops": false, Promotions: false });

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg({ success: "", error: "" });
    try {
      await api.auth.updateProfile(profile);
      setProfileMsg({ success: "Profile updated successfully", error: "" });
      showToast && showToast("Profile updated");
    } catch (err) {
      setProfileMsg({ success: "", error: err.message });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPwMsg({ success: "", error: "" });
    if (passwords.new !== passwords.confirm) { setPwMsg({ success: "", error: "Passwords don't match" }); return; }
    if (passwords.new.length < 6) { setPwMsg({ success: "", error: "New password must be at least 6 characters" }); return; }
    setPwLoading(true);
    try {
      await api.auth.changePassword(passwords.current, passwords.new);
      setPasswords({ current: "", new: "", confirm: "" });
      setPwMsg({ success: "Password changed successfully", error: "" });
    } catch (err) {
      setPwMsg({ success: "", error: err.message });
    } finally {
      setPwLoading(false);
    }
  };

  const handleAddressSave = (e) => {
    e.preventDefault();
    setAddressSaving(true);
    setTimeout(() => {
      setAddresses(prev => [...prev, { ...addressForm, id: Date.now() }]);
      setAddressForm({ label: "Home", address: "", city: "", state: "" });
      setShowAddressForm(false);
      setAddressSaving(false);
    }, 600);
  };

  if (!user) return (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
      <div>
        <div className="text-6xl mb-4 opacity-20">👤</div>
        <h2 className="text-2xl font-black text-white mb-2">Sign in to your account</h2>
        <p className="text-zinc-500 mb-8">Track orders, manage wishlist and more</p>
        <div className="flex gap-4 justify-center">
          <button onClick={() => onNavigate("LOGIN")} className="bg-white text-black px-8 py-3.5 rounded-xl font-bold tracking-wider text-sm">SIGN IN</button>
          <button onClick={() => onNavigate("REGISTER")} className="border border-zinc-700 text-zinc-300 px-8 py-3.5 rounded-xl font-semibold text-sm">CREATE ACCOUNT</button>
        </div>
      </div>
    </div>
  );

  const tabs = [["orders","Orders"],["wishlist","Wishlist"],["profile","Profile"],["addresses","Addresses"],["settings","Settings"]];
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 md:pb-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xl font-black text-white">{user.name?.[0]?.toUpperCase()}</div>
          <div>
            <h1 className="text-xl font-black text-white">Hey, {user.name} 👋</h1>
            <p className="text-zinc-500 text-sm">{user.email}</p>
          </div>
        </div>
        <button onClick={() => { logout(); onNavigate("HOME"); }} className="border border-zinc-800 text-zinc-400 px-4 py-2 rounded-xl text-sm hover:border-zinc-600 hover:text-white transition-colors">Sign out</button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 mb-8 overflow-x-auto">
        {tabs.map(([id,label]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`px-6 py-3 text-sm font-semibold tracking-wider whitespace-nowrap transition-colors border-b-2 -mb-px ${activeTab===id?"border-white text-white":"border-transparent text-zinc-500 hover:text-zinc-300"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Orders */}
      {activeTab === "orders" && (
        <div>
          {orders.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 opacity-20">📦</div>
              <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
              <p className="text-zinc-500 mb-8">Your order history will appear here</p>
              <button onClick={() => onNavigate("COLLECTION")} className="bg-white text-black px-8 py-3.5 rounded-xl font-bold tracking-wider text-sm">SHOP NOW</button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-white font-bold tracking-wider text-sm">{order.orderNumber || order.id}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">{order.date || new Date(order.createdAt).toLocaleDateString("en-NG",{day:"numeric",month:"short",year:"numeric"})} · {order.items.length} item{order.items.length>1?"s":""}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">{order.status}</span>
                      <p className="text-white font-bold mt-2">{fmt(order.total)}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {order.items.map(item => (
                      <div key={item.key || item.id} className="flex items-center gap-2 bg-zinc-800 rounded-xl px-3 py-2">
                        <span className="text-lg">{CATEGORIES.find(c => c.name === item.category)?.icon || "📦"}</span>
                        <span className="text-zinc-300 text-xs">{item.name}</span>
                        <span className="text-zinc-600 text-xs">×{item.qty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Wishlist */}
      {activeTab === "wishlist" && (
        <div>
          {wishlist.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4 opacity-20">❤️</div>
              <h3 className="text-xl font-bold text-white mb-2">Your wishlist is empty</h3>
              <p className="text-zinc-500 mb-8">Save items you love for later</p>
              <button onClick={() => onNavigate("COLLECTION")} className="bg-white text-black px-8 py-3.5 rounded-xl font-bold tracking-wider text-sm">SHOP NOW</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {wishlist.map(p => <ProductCard key={p.id} product={p} onNavigate={onNavigate}/>)}
            </div>
          )}
        </div>
      )}

      {/* Profile */}
      {activeTab === "profile" && (
        <div className="max-w-md">
          <form onSubmit={handleProfileSave} className="space-y-4">
            <AccountInputField label="Full Name" value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))} placeholder="Your full name"/>
            <AccountInputField label="Email Address" type="email" value={profile.email} onChange={e => setProfile(p => ({...p, email: e.target.value}))} placeholder="you@email.com"/>
            <AccountInputField label="Phone Number" type="tel" value={profile.phone} onChange={e => setProfile(p => ({...p, phone: e.target.value}))} placeholder="+234 800 000 0000"/>
            {profileMsg.success && <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 rounded-xl px-4 py-3"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>{profileMsg.success}</div>}
            {profileMsg.error && <div className="text-red-400 text-sm bg-red-500/10 rounded-xl px-4 py-3">{profileMsg.error}</div>}
            <button type="submit" disabled={profileLoading} className="w-full bg-white text-black py-3.5 rounded-xl font-bold text-sm tracking-wider hover:bg-zinc-100 transition-colors disabled:opacity-50">
              {profileLoading ? "SAVING..." : "SAVE CHANGES"}
            </button>
          </form>
        </div>
      )}

      {/* Addresses */}
      {activeTab === "addresses" && (
        <div className="max-w-2xl space-y-4">
          {addresses.map(addr => (
            <div key={addr.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-zinc-400 tracking-widest uppercase bg-zinc-800 px-2 py-1 rounded-lg mb-2 inline-block">{addr.label}</span>
                <p className="text-white text-sm font-medium mt-2">{addr.address}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{addr.city}, {addr.state}</p>
              </div>
              <button onClick={() => setAddresses(prev => prev.filter(a => a.id !== addr.id))} className="text-zinc-600 hover:text-red-400 transition-colors text-xs">Remove</button>
            </div>
          ))}

          {showAddressForm ? (
            <form onSubmit={handleAddressSave} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-white font-bold text-sm">Add new address</h3>
              <div>
                <label className="text-xs text-zinc-400 tracking-widest uppercase block mb-2">Label</label>
                <select value={addressForm.label} onChange={e => setAddressForm(f => ({...f, label: e.target.value}))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-600">
                  {["Home","Office","Other"].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <AccountInputField label="Street Address" value={addressForm.address} onChange={e => setAddressForm(f => ({...f, address: e.target.value}))} placeholder="123 Allen Avenue"/>
              <div className="grid grid-cols-2 gap-4">
                <AccountInputField label="City" value={addressForm.city} onChange={e => setAddressForm(f => ({...f, city: e.target.value}))} placeholder="Lagos"/>
                <AccountInputField label="State" value={addressForm.state} onChange={e => setAddressForm(f => ({...f, state: e.target.value}))} placeholder="Lagos State"/>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddressForm(false)} className="flex-1 border border-zinc-700 text-zinc-400 py-3 rounded-xl text-sm font-semibold">Cancel</button>
                <button type="submit" disabled={addressSaving} className="flex-1 bg-white text-black py-3 rounded-xl text-sm font-bold disabled:opacity-50">
                  {addressSaving ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>
          ) : (
            <button onClick={() => setShowAddressForm(true)} className="w-full border-2 border-dashed border-zinc-800 rounded-2xl p-6 text-center hover:border-zinc-600 transition-colors">
              <div className="text-3xl mb-2 opacity-30">📍</div>
              <p className="text-white font-semibold text-sm">Add a delivery address</p>
              <p className="text-zinc-500 text-xs mt-1">Save addresses for faster checkout</p>
            </button>
          )}
        </div>
      )}

      {/* Settings */}
      {activeTab === "settings" && (
        <div className="max-w-md space-y-6">
          {/* Change password */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h3 className="text-white font-bold text-sm tracking-wider mb-5">CHANGE PASSWORD</h3>
            <form onSubmit={handlePasswordSave} className="space-y-4">
              {[["current","Current password"],["new","New password"],["confirm","Confirm new password"]].map(([field,label]) => (
                <div key={field}>
                  <label className="text-xs text-zinc-400 tracking-widest uppercase block mb-2">{label}</label>
                  <div className="relative">
                    <input type={showPw ? "text" : "password"} value={passwords[field]} onChange={e => setPasswords(p => ({...p, [field]: e.target.value}))}
                      placeholder="••••••••" required
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors pr-14"/>
                    {field === "current" && (
                      <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs tracking-wider">{showPw?"HIDE":"SHOW"}</button>
                    )}
                  </div>
                </div>
              ))}
              {/* Password strength */}
              {passwords.new.length > 0 && (
                <div>
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${passwords.new.length >= i*3 ? i<=1?"bg-red-500":i<=2?"bg-amber-500":i<=3?"bg-blue-500":"bg-emerald-500" : "bg-zinc-800"}`}/>
                    ))}
                  </div>
                  <p className="text-zinc-500 text-xs">{passwords.new.length<6?"Too short":passwords.new.length<9?"Fair":passwords.new.length<12?"Good":"Strong"}</p>
                </div>
              )}
              {pwMsg.success && <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 rounded-xl px-4 py-3"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>{pwMsg.success}</div>}
              {pwMsg.error && <div className="text-red-400 text-sm bg-red-500/10 rounded-xl px-4 py-3">{pwMsg.error}</div>}
              <button type="submit" disabled={pwLoading} className="w-full bg-white text-black py-3.5 rounded-xl font-bold text-sm tracking-wider hover:bg-zinc-100 transition-colors disabled:opacity-50">
                {pwLoading ? "CHANGING..." : "CHANGE PASSWORD"}
              </button>
            </form>
          </div>

          {/* Account preferences */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-white font-bold text-sm tracking-wider">PREFERENCES</h3>
            {[
              { label: "Order updates", desc: "Email me when my order status changes" },
              { label: "New drops", desc: "Notify me about new DRØP product releases" },
              { label: "Promotions", desc: "Receive exclusive deals and discount codes" },
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-white text-sm font-medium">{pref.label}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{pref.desc}</p>
                </div>
                <button type="button" role="switch" aria-checked={!!preferences[pref.label]} onClick={() => setPreferences(p => ({...p, [pref.label]: !p[pref.label]}))}
                  className={`w-10 h-5 rounded-full relative flex-shrink-0 transition-colors ${preferences[pref.label] ? "bg-white" : "bg-zinc-700"}`}>
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${preferences[pref.label] ? "left-5 bg-black" : "left-0.5 bg-zinc-400"}`}/>
                </button>
              </div>
            ))}
          </div>

          {/* Danger */}
          <div className="bg-zinc-900 border border-red-500/20 rounded-2xl p-6 space-y-3">
            <h3 className="text-red-400 font-bold text-sm tracking-wider">DANGER ZONE</h3>
            <p className="text-zinc-500 text-xs">These actions are permanent and cannot be undone.</p>
            <button onClick={() => { logout(); onNavigate("HOME"); }} className="w-full border border-zinc-700 text-zinc-400 py-3 rounded-xl text-sm font-semibold hover:border-zinc-500 transition-colors">
              Sign out of all devices
            </button>
            <button onClick={() => showToast && showToast("Account deletion is not available yet", "info")} className="w-full border border-red-500/30 text-red-400 py-3 rounded-xl text-sm font-semibold hover:bg-red-500/10 transition-colors">
              Delete my account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Wishlist Page ─────────────────────────────────────────
export function WishlistPage({ onNavigate }) {
  const { wishlist, toggleWishlist } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 md:pb-10">
      <div className="mb-8">
        <div className="text-xs text-zinc-500 tracking-widest uppercase mb-1">Saved items</div>
        <h1 className="text-3xl font-black tracking-tight">MY WISHLIST</h1>
        <p className="text-zinc-500 text-sm mt-1">{wishlist.length} item{wishlist.length !== 1 ? "s" : ""}</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-7xl mb-5 opacity-15">❤️</div>
          <h2 className="text-2xl font-black text-white mb-2">Your wishlist is empty</h2>
          <p className="text-zinc-500 mb-8">Tap the heart icon on any product to save it here</p>
          <button onClick={() => onNavigate("COLLECTION")} className="bg-white text-black px-8 py-4 rounded-xl font-bold tracking-wider text-sm hover:bg-zinc-100 transition-colors">
            BROWSE PRODUCTS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map(p => <ProductCard key={p.id} product={p} onNavigate={onNavigate}/>)}
        </div>
      )}
    </div>
  );
}

// ── Checkout Page ─────────────────────────────────────────
export function CheckoutPage({ onNavigate }) {
  const { cart, cartTotal, placeOrder, user } = useApp();
  const [step, setStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(null);
  const [form, setForm] = useState({ firstName:"", lastName:"", email: user?.email||"", phone:"", address:"", city:"", state:"", promoCode:"" });
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [payMethod, setPayMethod] = useState("paystack");
  const set = (k) => (e) => setForm(f => ({...f, [k]: e.target.value}));
  const shipping = cartTotal >= 30000 ? 0 : 2500;
  const total = cartTotal + shipping - discount;

  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState("");

  const applyPromo = () => {
    if (form.promoCode.toUpperCase() === "DRØP15" || form.promoCode.toUpperCase() === "DROP15") {
      setDiscount(Math.round(cartTotal * 0.15)); setPromoError("");
    } else { setPromoError("Invalid promo code"); setDiscount(0); }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      setOrderError("Please sign in to complete your order.");
      return;
    }
    setOrderError("");
    setPlacing(true);
    try {
      const order = await placeOrder({
        address: `${form.address}, ${form.city}, ${form.state}`,
        phone: form.phone,
        payMethod,
        promoCode: form.promoCode,
      });
      setOrderComplete(order);
      setStep(3);
    } catch (err) {
      setOrderError(err.message || "Could not place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0 && !orderComplete) return (
    <div className="min-h-[60vh] flex items-center justify-center text-center px-4">
      <div>
        <div className="text-6xl mb-4 opacity-20">🛒</div>
        <h2 className="text-2xl font-black text-white mb-2">Your cart is empty</h2>
        <p className="text-zinc-500 mb-8">Add items before checking out</p>
        <button onClick={() => onNavigate("COLLECTION")} className="bg-white text-black px-8 py-3.5 rounded-xl font-bold text-sm">SHOP NOW</button>
      </div>
    </div>
  );

  if (step === 3 && orderComplete) return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pb-24 md:pb-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
        </div>
        <h1 className="text-3xl font-black text-white mb-2">Order Placed! 🎉</h1>
        <p className="text-zinc-400 mb-1">Order ID: <span className="text-white font-bold">{orderComplete.id}</span></p>
        <p className="text-zinc-400 text-sm mb-8">You'll receive a confirmation email at <span className="text-white">{form.email}</span></p>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8 text-left">
          <h3 className="text-white font-bold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            {orderComplete.items.map(item => (
              <div key={item.key} className="flex justify-between">
                <span className="text-zinc-400">{item.name} ×{item.qty}</span>
                <span className="text-white">{fmt(item.price * item.qty)}</span>
              </div>
            ))}
            <div className="border-t border-zinc-800 pt-2 mt-2 flex justify-between font-bold">
              <span className="text-white">Total</span><span className="text-white">{fmt(orderComplete.total)}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <button onClick={() => onNavigate("ACCOUNT")} className="border border-zinc-700 text-zinc-300 px-6 py-3 rounded-xl text-sm font-semibold hover:border-zinc-500 transition-colors">View Orders</button>
          <button onClick={() => onNavigate("HOME")} className="bg-white text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-100 transition-colors">Continue Shopping</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 md:pb-10">
      <h1 className="text-2xl font-black tracking-tight mb-8">CHECKOUT</h1>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-10">
        {[["1","Delivery"],["2","Payment"]].map(([num, label], i) => (
          <div key={num} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${step > i+1 ? "bg-emerald-500 border-emerald-500 text-white" : step === i+1 ? "border-white text-white" : "border-zinc-700 text-zinc-600"}`}>
              {step > i+1 ? <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> : num}
            </div>
            <span className={`text-sm font-semibold ${step===i+1?"text-white":"text-zinc-500"}`}>{label}</span>
            {i < 1 && <div className="w-12 h-px bg-zinc-800 mx-1"/>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-6">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-white font-bold tracking-wider">DELIVERY DETAILS</h2>
              <div className="grid grid-cols-2 gap-4">
                {[["firstName","First Name"],["lastName","Last Name"]].map(([k,l]) => (
                  <div key={k}>
                    <label className="text-xs text-zinc-400 tracking-widest uppercase block mb-2">{l}</label>
                    <input value={form[k]} onChange={set(k)} required placeholder={l}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500"/>
                  </div>
                ))}
              </div>
              {[["email","Email Address","email","you@email.com"],["phone","Phone Number","tel","+234 800 000 0000"],["address","Street Address","text","123 Allen Avenue"],["city","City","text","Lagos"],["state","State","text","Lagos State"]].map(([k,l,t,ph]) => (
                <div key={k}>
                  <label className="text-xs text-zinc-400 tracking-widest uppercase block mb-2">{l}</label>
                  <input type={t} value={form[k]} onChange={set(k)} required placeholder={ph}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500"/>
                </div>
              ))}
              <button onClick={() => { if(form.firstName && form.email && form.address) setStep(2); }}
                className="w-full bg-white text-black py-4 rounded-xl font-black tracking-wider text-sm hover:bg-zinc-100 transition-colors">
                CONTINUE TO PAYMENT
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <button onClick={() => setStep(1)} className="text-zinc-400 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <h2 className="text-white font-bold tracking-wider">PAYMENT METHOD</h2>
              </div>
              {[["paystack","Paystack","Pay securely with card, bank transfer or USSD"],["bank","Bank Transfer","Transfer directly to our account"],["pod","Pay on Delivery","Cash on delivery (Lagos only)"]].map(([id,label,desc]) => (
                <label key={id} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payMethod===id?"border-white bg-zinc-900":"border-zinc-800 hover:border-zinc-600"}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${payMethod===id?"border-white":"border-zinc-600"}`}>
                    {payMethod===id && <div className="w-2.5 h-2.5 bg-white rounded-full"/>}
                  </div>
                  <input type="radio" name="pay" value={id} checked={payMethod===id} onChange={() => setPayMethod(id)} className="hidden"/>
                  <div><p className="text-white font-semibold text-sm">{label}</p><p className="text-zinc-500 text-xs mt-0.5">{desc}</p></div>
                </label>
              ))}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <p className="text-zinc-400 text-xs mb-3 tracking-widest uppercase">Order total: <span className="text-white font-bold">{fmt(total)}</span></p>
                <p className="text-zinc-500 text-xs">🔒 Your payment info is encrypted and secure. DRØP never stores card details.</p>
              </div>
              {!user && (
                <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-sm rounded-xl px-4 py-3">
                  You need to <button onClick={() => onNavigate("LOGIN")} className="underline font-semibold">sign in</button> before placing your order.
                </div>
              )}
              {orderError && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">{orderError}</div>}
              <button onClick={handlePlaceOrder} disabled={placing} className="w-full bg-white text-black py-4 rounded-xl font-black tracking-wider text-sm hover:bg-zinc-100 transition-colors disabled:opacity-50">
                {placing ? "PLACING ORDER..." : `PLACE ORDER — ${fmt(total)}`}
              </button>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24">
            <h3 className="text-white font-bold tracking-wider mb-5">ORDER SUMMARY</h3>
            <div className="space-y-3 mb-5">
              {cart.map(item => (
                <div key={item.key} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center text-xl flex-shrink-0 relative">
                    {item.category === "Tops" ? "👕" : item.category === "Jeans" ? "👖" : item.category === "Caps" ? "🧢" : item.category === "Shoes" ? "👟" : item.category === "Watches" ? "⌚" : item.category === "Belts" ? "🪢" : "🩲"}
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-zinc-600 rounded-full text-[9px] flex items-center justify-center text-white font-bold">{item.qty}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{item.name}</p>
                    <p className="text-zinc-500 text-[10px]">Size: {item.selectedSize}</p>
                  </div>
                  <span className="text-white text-sm font-bold flex-shrink-0">{fmt(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            {/* Promo */}
            <div className="mb-5">
              <div className="flex gap-2">
                <input value={form.promoCode} onChange={set("promoCode")} placeholder="Promo code"
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500"/>
                <button onClick={applyPromo} className="border border-zinc-700 text-zinc-300 px-4 py-2.5 rounded-xl text-sm hover:border-zinc-500 transition-colors whitespace-nowrap">Apply</button>
              </div>
              {promoError && <p className="text-red-400 text-xs mt-1">{promoError}</p>}
              {discount > 0 && <p className="text-emerald-400 text-xs mt-1">✓ Promo applied — {fmt(discount)} saved!</p>}
            </div>
            <div className="space-y-2 border-t border-zinc-800 pt-4">
              <div className="flex justify-between text-sm"><span className="text-zinc-400">Subtotal</span><span className="text-white">{fmt(cartTotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-zinc-400">Shipping</span><span className={shipping===0?"text-emerald-400":"text-white"}>{shipping===0?"FREE":fmt(shipping)}</span></div>
              {discount > 0 && <div className="flex justify-between text-sm"><span className="text-zinc-400">Discount</span><span className="text-emerald-400">−{fmt(discount)}</span></div>}
              <div className="flex justify-between font-bold border-t border-zinc-800 pt-3 mt-3">
                <span className="text-white">Total</span><span className="text-white text-lg">{fmt(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Lookbook Page ─────────────────────────────────────────
export function LookbookPage({ onNavigate }) {
  const { addToCart } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-28 md:pb-10">
      <div className="text-center mb-14">
        <div className="text-xs text-zinc-500 tracking-widest uppercase mb-3">Season 01</div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-4">LATEST LOOKS</h1>
        <p className="text-zinc-400 max-w-md mx-auto">Full outfits curated by the DRØP team. Every piece is available now.</p>
      </div>

      <div className="space-y-16">
        {LOOKS.map((look, lookIdx) => {
          const products = look.productIds.map(id => ALL_PRODUCTS.find(p => p.id === id)).filter(Boolean);
          return (
            <div key={look.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${lookIdx % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
              {/* Hero image */}
              <div className={`aspect-[3/4] rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-950 relative ${lookIdx % 2 === 1 ? "lg:order-2" : ""}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[160px] opacity-15">{look.icon}</span>
                </div>
                <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at 60% 30%,#ffffff08,transparent)"}}/>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
                  <p className="text-zinc-400 text-xs tracking-widest uppercase mb-1">{look.tag}</p>
                  <h2 className="text-white font-black text-3xl tracking-tight">{look.title}</h2>
                </div>
              </div>
              {/* Products */}
              <div className={lookIdx % 2 === 1 ? "lg:order-1" : ""}>
                <div className="text-xs text-zinc-500 tracking-widest uppercase mb-2">Shop this look</div>
                <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{look.title}</h2>
                <p className="text-zinc-400 text-sm mb-8">{look.desc}</p>
                <div className="space-y-3">
                  {products.map(p => p && (
                    <div key={p.id} className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-600 transition-colors cursor-pointer" onClick={() => onNavigate("PRODUCT", p)}>
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0" style={{background:`radial-gradient(ellipse,${p.colors[0]}33,#111)`}}>
                        {CATEGORIES.find(c=>c.name===p.category)?.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm">{p.name}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">{p.category}</p>
                        <div className="flex gap-1 mt-1.5">
                          {p.colors.map((c,i) => <div key={i} className="w-3 h-3 rounded-full border border-zinc-700" style={{background:c}}/>)}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-white font-bold text-sm">{fmt(p.price)}</p>
                        {p.oldPrice && <p className="text-zinc-600 text-xs line-through">{fmt(p.oldPrice)}</p>}
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={() => { products.forEach(p => p && addToCart(p, p.sizes[0], p.colors[0])); }}
                  className="w-full mt-6 bg-white text-black py-4 rounded-xl font-black tracking-wider text-sm hover:bg-zinc-100 transition-colors">
                  ADD FULL LOOK TO CART — {fmt(products.reduce((s,p) => s + (p?.price||0), 0))}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── FAQ Page ──────────────────────────────────────────────
export function FAQPage() {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "How long does delivery take?", a: "Standard delivery takes 3–5 business days. Express delivery (1–2 business days) is available at checkout for an additional fee. We currently deliver across Nigeria." },
    { q: "Is delivery free?", a: "Yes! Orders above ₦30,000 qualify for free standard delivery. Orders below this threshold have a flat delivery fee of ₦2,500." },
    { q: "What is your return policy?", a: "We accept returns within 7 days of delivery. Items must be unworn, unwashed, and in original packaging with tags attached. Your first return is free — just contact us to initiate." },
    { q: "Are the products authentic?", a: "100%. DRØP only sells original, in-house designed products. Everything is quality checked before shipping. We don't resell third-party goods." },
    { q: "How do I know my size?", a: "Each product page has a Size Guide tab with detailed measurements. If you're between sizes, we recommend sizing up for an oversized look or sizing down for a fitted look." },
    { q: "What payment methods do you accept?", a: "We accept all major cards (Visa, Mastercard, Verve) via Paystack, bank transfers, and USSD payments. Pay on Delivery is available for Lagos orders." },
    { q: "Can I change or cancel my order?", a: "Orders can be modified or cancelled within 1 hour of placement. After that, the order enters fulfillment. Contact us immediately at support@drop.ng if you need to make changes." },
    { q: "Do you ship internationally?", a: "Not yet — we're currently Nigeria only. International shipping is coming soon. Join our newsletter to be notified when it launches." },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 pb-28 md:pb-14">
      <div className="text-center mb-12">
        <div className="text-xs text-zinc-500 tracking-widest uppercase mb-3">Help center</div>
        <h1 className="text-4xl font-black tracking-tight text-white mb-4">FREQUENTLY ASKED QUESTIONS</h1>
        <p className="text-zinc-400">Can't find your answer? Email us at <a href="mailto:support@drop.ng" className="text-white underline underline-offset-2">support@drop.ng</a></p>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors">
            <button onClick={() => setOpen(open===i?null:i)} className="w-full flex items-center justify-between px-6 py-5 text-left">
              <span className="text-white font-semibold text-sm pr-4">{faq.q}</span>
              <svg className={`w-5 h-5 text-zinc-400 flex-shrink-0 transition-transform duration-200 ${open===i?"rotate-180":""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
            {open === i && (
              <div className="px-6 pb-5 border-t border-zinc-800 pt-4">
                <p className="text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── About Page ────────────────────────────────────────────
export function AboutPage({ onNavigate }) {
  return (
    <div className="pb-28 md:pb-0">
      <div className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-black"/>
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 60px,#fff 60px,#fff 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,#fff 60px,#fff 61px)"}}/>
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="text-xs text-zinc-500 tracking-widest uppercase mb-4">Our story</div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-6">WE ARE DRØP</h1>
          <p className="text-zinc-400 text-lg leading-relaxed">Born in Lagos. Built for the streets. DRØP started as a vision — premium streetwear that reflects the energy, creativity, and relentless ambition of African youth.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[["2022","Founded in Lagos"],["5,200+","Satisfied customers"],["100%","Authentic, always"]].map(([num, label]) => (
            <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
              <div className="text-4xl font-black text-white mb-2">{num}</div>
              <div className="text-zinc-500 text-sm">{label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <h2 className="text-3xl font-black text-white mb-4">Quality without compromise.</h2>
            <p className="text-zinc-400 leading-relaxed mb-4">Every DRØP piece is designed in-house and produced with premium materials. We don't cut corners — from the thread count on our tees to the leather on our belts.</p>
            <p className="text-zinc-400 leading-relaxed">We drop new pieces every Friday. Limited quantities. Once it's gone, it's gone. That's the DRØP way.</p>
          </div>
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
            <span className="text-[100px] opacity-20">👕</span>
          </div>
        </div>
        <div className="text-center">
          <button onClick={() => onNavigate("COLLECTION")} className="bg-white text-black px-10 py-5 rounded-xl font-black tracking-widest text-sm hover:bg-zinc-100 transition-colors hover:scale-105 active:scale-95">
            SHOP THE COLLECTION
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Contact Page ──────────────────────────────────────────
export function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);
  const set = k => e => setForm(f => ({...f,[k]:e.target.value}));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 pb-28 md:pb-14">
      <div className="text-center mb-12">
        <div className="text-xs text-zinc-500 tracking-widest uppercase mb-3">Get in touch</div>
        <h1 className="text-4xl font-black tracking-tight text-white mb-4">CONTACT US</h1>
        <p className="text-zinc-400">We reply within 24 hours on business days.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {[["📧","Email","support@drop.ng"],["📍","Location","Lagos, Nigeria"],["⏰","Hours","Mon–Fri, 9am–6pm"]].map(([icon,l,v]) => (
          <div key={l} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center">
            <div className="text-2xl mb-2">{icon}</div>
            <p className="text-zinc-500 text-xs tracking-widest uppercase mb-1">{l}</p>
            <p className="text-white text-sm font-semibold">{v}</p>
          </div>
        ))}
      </div>
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        {sent ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Message sent!</h3>
            <p className="text-zinc-400 text-sm">We'll get back to you within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[["name","Name","Your name"],["email","Email","you@email.com"]].map(([k,l,ph]) => (
                <div key={k}>
                  <label className="text-xs text-zinc-400 tracking-widest uppercase block mb-2">{l}</label>
                  <input type={k==="email"?"email":"text"} value={form[k]} onChange={set(k)} required placeholder={ph}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500"/>
                </div>
              ))}
            </div>
            <div>
              <label className="text-xs text-zinc-400 tracking-widest uppercase block mb-2">Subject</label>
              <select value={form.subject} onChange={set("subject")} required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-zinc-500">
                <option value="">Select a topic</option>
                {["Order issue","Return / Exchange","Product question","Wholesale","Other"].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-zinc-400 tracking-widest uppercase block mb-2">Message</label>
              <textarea value={form.message} onChange={set("message")} required rows={5} placeholder="Tell us how we can help..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500 resize-none"/>
            </div>
            <button type="submit" className="w-full bg-white text-black py-4 rounded-xl font-black tracking-wider text-sm hover:bg-zinc-100 transition-colors">
              SEND MESSAGE
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Reset Password Page ──────────────────────────────────
// Reached via the link emailed by "Forgot password?" — /reset-password/:token
export function ForgotPasswordPage({ onNavigate }) {
  const { forgotPassword } = useApp();
  const location = useLocation();
  const initialEmail = (() => {
    try {
      const saved = localStorage.getItem("drop_password_reset_email") || "";
      const params = new URLSearchParams(location.search);
      return params.get("email") || saved;
    } catch {
      return "";
    }
  })();
  const [email, setEmail] = useState(initialEmail);
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setResetUrl("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Enter the email connected to your account.");
      return;
    }
    setLoading(true);
    try {
      const res = await forgotPassword(trimmedEmail);
      setMessage(`If an account exists for ${trimmedEmail}, we'll send a link where you can choose a new password.`);
      if (res?.resetUrl) setResetUrl(res.resetUrl);
    } catch (err) {
      const text = err.message || "";
      if (text.toLowerCase().includes("forgot-password") || text.toLowerCase().includes("not found")) {
        setError("Password reset is not enabled on the backend yet. Add the forgot-password API route, then try again.");
      } else {
        setError(text || "Couldn't send the reset link. Please try again in a moment.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pb-24 md:pb-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <button onClick={() => onNavigate("HOME")} className="text-white font-black text-3xl tracking-widest mb-6 block mx-auto">DRØP</button>
          <h1 className="text-2xl font-black tracking-tight text-white">Reset your password</h1>
          <p className="text-zinc-500 text-sm mt-2">Enter your email and we'll send the link to set a new one</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>}
          {message && (
            <div className="flex items-start gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-xl px-4 py-3 mb-5">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span>{message}</span>
            </div>
          )}
          {resetUrl && (
            <button type="button" onClick={() => window.location.assign(resetUrl)}
              className="w-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 py-3.5 rounded-xl font-bold text-sm hover:bg-emerald-500/20 transition-colors mb-5">
              OPEN RESET FORM
            </button>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 tracking-widest uppercase block mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@email.com"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"/>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-white text-black py-4 rounded-xl font-black tracking-wider text-sm hover:bg-zinc-100 transition-colors mt-2 disabled:opacity-50">
              {loading ? "SENDING..." : "SEND RESET LINK"}
            </button>
          </form>
          <p className="text-center text-zinc-500 text-sm mt-6">
            Remembered your password?{" "}
            <button onClick={() => onNavigate("LOGIN")} className="text-white font-semibold hover:underline">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}

export function ResetPasswordPage({ onNavigate }) {
  const { resetPassword } = useApp();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!password || !confirm) { setError("Please fill in both fields"); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    if (password !== confirm) { setError("Passwords don't match"); return; }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err.message || "This reset link is invalid or has expired. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 pb-24 md:pb-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <button onClick={() => onNavigate("HOME")} className="text-white font-black text-3xl tracking-widest mb-6 block mx-auto">DRØP</button>
          <h1 className="text-2xl font-black tracking-tight text-white">Set a new password</h1>
          <p className="text-zinc-500 text-sm mt-2">Choose a new password for your account</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          {done ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Password updated</h3>
              <p className="text-zinc-400 text-sm mb-6">You can now sign in with your new password.</p>
              <button onClick={() => onNavigate("LOGIN")} className="bg-white text-black px-8 py-3.5 rounded-xl font-bold tracking-wider text-sm hover:bg-zinc-100 transition-colors">
                GO TO SIGN IN
              </button>
            </div>
          ) : (
            <>
              {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-400 tracking-widest uppercase block mb-2">New Password</label>
                  <div className="relative">
                    <input type={showPw?"text":"password"} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors pr-12"/>
                    <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 text-xs">
                      {showPw ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-zinc-400 tracking-widest uppercase block mb-2">Confirm Password</label>
                  <input type={showPw?"text":"password"} value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="••••••••"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"/>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-white text-black py-4 rounded-xl font-black tracking-wider text-sm hover:bg-zinc-100 transition-colors mt-2 disabled:opacity-50">
                  {loading ? "UPDATING..." : "UPDATE PASSWORD"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
