import { useState, useEffect } from "react";
import { ALL_PRODUCTS, CATEGORIES, LOOKS, REVIEWS_DATA, fmt } from "../data/products";
import { ProductCard, Stars } from "../components/Shared";
import { useApp } from "../context/AppContext";

export default function HomePage({ onNavigate }) {
  const { addToCart } = useApp();
  const newArrivals = ALL_PRODUCTS.filter(p => p.badge === "New" || p.badge === "Limited").slice(0, 6);
  const bestsellers = ALL_PRODUCTS.filter(p => p.badge === "🔥 Hot" || p.reviews > 50).slice(0, 4);

  return (
    <div className="pb-20 md:pb-0">
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-black to-zinc-950"/>
        <div className="absolute inset-0 opacity-25" style={{backgroundImage:"radial-gradient(ellipse 80% 80% at 50% -20%,#3f3f46,transparent)"}}/>
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 80px,#fff 80px,#fff 81px),repeating-linear-gradient(90deg,transparent,transparent 80px,#fff 80px,#fff 81px)"}}/>
        <div className="absolute right-[5%] top-[15%] w-80 h-80 rounded-full bg-zinc-800/20 blur-3xl"/>
        <div className="absolute left-[5%] bottom-[15%] w-56 h-56 rounded-full bg-zinc-700/10 blur-2xl"/>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-zinc-500"/>
              <span className="text-zinc-400 text-xs tracking-[0.3em] uppercase">Season 01 — Limited Drop</span>
            </div>
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none mb-6">
              <span className="text-white block">DRESS</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 via-zinc-400 to-zinc-600 block">LIKE YOU</span>
              <span className="text-white block">MEAN IT.</span>
            </h1>
            <p className="text-zinc-400 text-lg mb-10 max-w-md leading-relaxed">Premium streetwear for those who move different. New drops every Friday — limited pieces, no restock.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => onNavigate("COLLECTION")} className="bg-white text-black px-8 py-4 rounded-xl font-bold tracking-widest text-sm hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95">
                SHOP THE DROP
              </button>
              <button onClick={() => onNavigate("LOOKBOOK")} className="border border-zinc-700 text-zinc-300 px-8 py-4 rounded-xl font-semibold tracking-wider text-sm hover:border-zinc-400 hover:text-white transition-all">
                VIEW LOOKBOOK →
              </button>
            </div>
            <div className="flex gap-8 mt-14 pt-8 border-t border-zinc-800">
              {[["5,200+","Customers"],["100%","Authentic"],["48hr","Delivery"]].map(([val,label]) => (
                <div key={label}><div className="text-white font-black text-xl">{val}</div><div className="text-zinc-500 text-xs tracking-wider mt-0.5">{label}</div></div>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-zinc-600"/>
          <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
        </div>
      </section>

      {/* Trust Strip */}
      <div className="bg-zinc-900 border-y border-zinc-800 py-4 px-4 overflow-x-auto">
        <div className="flex items-center justify-around gap-4 min-w-max mx-auto max-w-4xl">
          {[["🚚","Free Delivery","Orders above ₦30k"],["↩️","Easy Returns","7-day policy"],["🔒","Secure Checkout","256-bit SSL"],["⭐","Verified Reviews","Real customers only"]].map(([icon,title,sub]) => (
            <div key={title} className="flex items-center gap-3 px-4">
              <span className="text-xl">{icon}</span>
              <div><p className="text-white text-xs font-semibold tracking-wide">{title}</p><p className="text-zinc-500 text-[10px]">{sub}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div><div className="text-xs text-zinc-500 tracking-widest uppercase mb-1">Browse</div><h2 className="text-2xl font-black tracking-tight">SHOP BY CATEGORY</h2></div>
          <button onClick={() => onNavigate("COLLECTION")} className="text-zinc-400 hover:text-white text-sm tracking-wider transition-colors">View all →</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {CATEGORIES.map(cat => (
            <button key={cat.id} onClick={() => onNavigate(cat.name.toUpperCase())} className="group relative rounded-2xl overflow-hidden aspect-square">
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.bg} group-hover:scale-105 transition-transform duration-300`}/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>
              <div className="relative h-full flex flex-col items-center justify-between p-4">
                <span className="text-3xl group-hover:scale-110 transition-transform duration-300">{cat.icon}</span>
                <div className="text-center"><p className="text-white text-xs font-bold tracking-wider">{cat.name.toUpperCase()}</p><p className="text-zinc-500 text-[10px] mt-0.5">{cat.count} items</p></div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div><div className="text-xs text-zinc-500 tracking-widest uppercase mb-1">Just dropped</div><h2 className="text-2xl font-black tracking-tight">NEW ARRIVALS</h2></div>
          <button onClick={() => onNavigate("COLLECTION")} className="text-zinc-400 hover:text-white text-sm tracking-wider transition-colors">View all →</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {newArrivals.map(p => <ProductCard key={p.id} product={p} onNavigate={onNavigate}/>)}
        </div>
      </section>

      {/* Lookbook */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div><div className="text-xs text-zinc-500 tracking-widest uppercase mb-1">Editorial</div><h2 className="text-2xl font-black tracking-tight">LATEST LOOKS</h2></div>
          <button onClick={() => onNavigate("LOOKBOOK")} className="text-zinc-400 hover:text-white text-sm tracking-wider transition-colors">Full lookbook →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LOOKS.map((look, i) => (
            <div key={look.id} className="group relative rounded-2xl overflow-hidden cursor-pointer" onClick={() => onNavigate("LOOKBOOK")}>
              <div className={`${i === 0 ? "aspect-[4/5]" : "aspect-square"} bg-gradient-to-br from-zinc-800 to-zinc-950 group-hover:scale-[1.02] transition-transform duration-500`}>
                <div className="absolute inset-0 flex items-center justify-center"><span className="text-8xl opacity-20 group-hover:opacity-30 transition-opacity duration-300">{look.icon}</span></div>
                <div className="absolute inset-0" style={{background:`radial-gradient(ellipse at ${i===0?"70% 30%":"50% 40%"},#ffffff08,transparent)`}}/>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"/>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-zinc-400 text-[10px] tracking-widest uppercase mb-1">{look.tag}</p>
                <h3 className="text-white font-black text-lg tracking-tight">{look.title}</h3>
                <p className="text-zinc-400 text-xs mt-1">{look.desc}</p>
                <span className="mt-3 inline-block text-xs font-semibold tracking-wider text-white border-b border-zinc-600 hover:border-white transition-colors pb-0.5">SHOP THIS LOOK →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-zinc-950 border-t border-zinc-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div><div className="text-xs text-zinc-500 tracking-widest uppercase mb-1">Community favourites</div><h2 className="text-2xl font-black tracking-tight">BEST SELLERS</h2></div>
            <button onClick={() => onNavigate("COLLECTION")} className="text-zinc-400 hover:text-white text-sm tracking-wider transition-colors">View all →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bestsellers.map(p => <ProductCard key={p.id} product={p} onNavigate={onNavigate}/>)}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div><div className="text-xs text-zinc-500 tracking-widest uppercase mb-1">Social proof</div><h2 className="text-2xl font-black tracking-tight">WHAT THEY SAY</h2></div>
          <div className="flex items-center gap-2"><Stars rating={5}/><span className="text-zinc-400 text-xs">4.8 / 5 (284 reviews)</span></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REVIEWS_DATA.slice(0,3).map(r => (
            <div key={r.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold text-white">{r.avatar}</div>
                  <div><p className="text-white text-sm font-semibold">{r.name}</p><p className="text-zinc-600 text-[10px] mt-0.5">{r.date}</p></div>
                </div>
                <svg className="w-6 h-6 text-zinc-800" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
              </div>
              <Stars rating={r.rating}/>
              <p className="text-zinc-300 text-sm leading-relaxed mt-3">{r.text}</p>
              <div className="mt-4 pt-4 border-t border-zinc-800"><span className="text-zinc-600 text-[10px] tracking-wider">Verified purchase · {r.product}</span></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
