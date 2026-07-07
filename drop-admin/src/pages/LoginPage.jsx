import { useState } from "react";
import { useAdmin } from "../context/AdminContext";

export default function LoginPage() {
  const { login } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient grid background */}
      <div className="absolute inset-0 opacity-[0.04]" style={{backgroundImage:"linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px"}}/>
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-lime-400/[0.04] blur-[120px]"/>

      <div className="relative w-full max-w-[380px]">
        <div className="text-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-lime-400 flex items-center justify-center mx-auto mb-4">
            <span className="text-black font-black text-lg">D</span>
          </div>
          <div className="text-white font-bold text-xl tracking-tight">DRØP Control</div>
          <p className="text-zinc-600 text-[13px] mt-1.5 font-mono">RESTRICTED ACCESS</p>
        </div>

        <div className="bg-[#0E0E10] border border-white/[0.08] rounded-2xl p-7 shadow-2xl shadow-black/40">
          {error && (
            <div className="flex items-start gap-2.5 bg-red-500/[0.08] border border-red-500/20 text-red-400 text-[13px] rounded-xl px-3.5 py-3 mb-5">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[11px] text-zinc-500 font-semibold tracking-wider uppercase block mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus
                placeholder="admin@drop.ng"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-3 text-white text-[14px] placeholder-zinc-700 focus:outline-none focus:border-lime-400/40 focus:bg-white/[0.05] transition-colors"/>
            </div>
            <div>
              <label className="text-[11px] text-zinc-500 font-semibold tracking-wider uppercase block mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-3 text-white text-[14px] placeholder-zinc-700 focus:outline-none focus:border-lime-400/40 focus:bg-white/[0.05] transition-colors"/>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-lime-400 text-black py-3 rounded-xl font-bold text-[13.5px] tracking-tight hover:bg-lime-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Signing in
                </>
              ) : "Sign in"}
            </button>
          </form>
        </div>
        <p className="text-center text-zinc-700 text-[12px] mt-6 font-mono">v1.0 · Admin access only</p>
      </div>
    </div>
  );
}
