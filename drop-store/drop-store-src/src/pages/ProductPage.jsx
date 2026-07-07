import { useState } from "react";
import { ALL_PRODUCTS, REVIEWS_DATA, CATEGORIES, fmt } from "../data/products";
import { Stars, ProductCard } from "../components/Shared";
import { useApp } from "../context/AppContext";

export default function ProductPage({ product, onNavigate }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [imgIdx, setImgIdx] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewName, setReviewName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [qty, setQty] = useState(1);

  const wished = isWishlisted(product.id);
  const catIcon = CATEGORIES.find(c => c.name === product.category)?.icon;
  const related = ALL_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const productReviews = REVIEWS_DATA.filter(r => r.productId === product.id);

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, qty);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (reviewText && reviewName) setSubmitted(true);
  };

  // Simulated image slots
  const images = [0, 1, 2, 3];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 md:pb-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-zinc-500 mb-8">
        <button onClick={() => onNavigate("HOME")} className="hover:text-white transition-colors">Home</button>
        <span>/</span>
        <button onClick={() => onNavigate(product.category.toUpperCase())} className="hover:text-white transition-colors">{product.category}</button>
        <span>/</span>
        <span className="text-zinc-300 truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 relative">
            <div className="w-full h-full flex items-center justify-center"
              style={{background:`radial-gradient(ellipse at 60% 30%,${selectedColor}44,#0a0a0a)`}}>
              <span className="text-[120px] opacity-30">{catIcon}</span>
            </div>
            <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 60px,#fff 60px,#fff 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,#fff 60px,#fff 61px)"}}/>
            {product.badge && (
              <div className="absolute top-4 left-4">
                <span className={`text-white text-xs font-bold px-3 py-1.5 rounded-full ${product.badge==="Sale"?"bg-red-500":product.badge==="Limited"?"bg-purple-500":product.badge==="🔥 Hot"?"bg-orange-500":"bg-emerald-500"}`}>
                  {product.badge}
                </span>
              </div>
            )}
          </div>
          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {images.map(i => (
              <button key={i} onClick={() => setImgIdx(i)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${imgIdx===i ? "border-white" : "border-zinc-800 hover:border-zinc-600"}`}>
                <div className="w-full h-full flex items-center justify-center bg-zinc-900"
                  style={{background:`radial-gradient(ellipse,${selectedColor}33,#111)`}}>
                  <span className="text-2xl opacity-30">{catIcon}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="text-xs text-zinc-500 uppercase tracking-widest mb-2">{product.category}</div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-3">{product.name}</h1>
            <div className="flex items-center gap-3">
              <Stars rating={product.rating} size="lg"/>
              <span className="text-zinc-400 text-sm">{product.rating} ({product.reviews} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-black text-white">{fmt(product.price)}</span>
            {product.oldPrice && <>
              <span className="text-zinc-500 text-lg line-through">{fmt(product.oldPrice)}</span>
              <span className="bg-red-500/20 text-red-400 text-sm font-bold px-2 py-0.5 rounded-lg">-{discount}%</span>
            </>}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? "bg-emerald-400" : product.stock > 0 ? "bg-amber-400" : "bg-red-400"}`}/>
            <span className="text-sm text-zinc-400">
              {product.stock > 10 ? "In stock" : product.stock > 0 ? `Only ${product.stock} left — order soon` : "Out of stock"}
            </span>
          </div>

          <div className="w-full h-px bg-zinc-800"/>

          {/* Color */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-widest text-white">COLOUR</span>
            </div>
            <div className="flex gap-3">
              {product.colors.map((c, i) => (
                <button key={i} onClick={() => setSelectedColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${selectedColor===c ? "border-white scale-110 shadow-lg" : "border-zinc-700"}`}
                  style={{background:c}}/>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold tracking-widest text-white">SIZE</span>
              <button className="text-xs text-zinc-400 hover:text-white underline underline-offset-2 transition-colors">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button key={size} onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] h-11 px-3 rounded-xl border-2 text-sm font-bold transition-all ${selectedSize===size ? "border-white bg-white text-black" : "border-zinc-700 text-zinc-300 hover:border-zinc-500"}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold tracking-widest text-white">QTY</span>
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2">
              <button onClick={() => setQty(q => Math.max(1,q-1))} className="text-zinc-400 hover:text-white w-6 h-6 flex items-center justify-center text-lg">−</button>
              <span className="text-white font-bold w-6 text-center">{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock,q+1))} className="text-zinc-400 hover:text-white w-6 h-6 flex items-center justify-center text-lg">+</button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className="flex-1 bg-white text-black py-4 rounded-xl font-black tracking-wider text-sm hover:bg-zinc-100 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
              {product.stock === 0 ? "OUT OF STOCK" : "ADD TO CART"}
            </button>
            <button onClick={() => toggleWishlist(product)}
              className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${wished ? "border-red-500 bg-red-500/10" : "border-zinc-700 hover:border-zinc-500"}`}>
              <svg className={`w-5 h-5 ${wished ? "text-red-400" : "text-zinc-400"}`} fill={wished?"currentColor":"none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
          </div>

          {/* Perks */}
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 space-y-3">
            {[["🚚","Free delivery","on orders above ₦30,000"],["↩️","Easy returns","within 7 days of delivery"],["🔒","Secure payment","your data is safe with us"]].map(([icon,title,sub]) => (
              <div key={title} className="flex items-center gap-3">
                <span className="text-lg">{icon}</span>
                <div><p className="text-white text-xs font-semibold">{title}</p><p className="text-zinc-500 text-[11px]">{sub}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-12">
        <div className="flex border-b border-zinc-800 mb-8">
          {[["description","Description"],["reviews",`Reviews (${productReviews.length + product.reviews})`],["sizing","Size Guide"],["shipping","Shipping"]].map(([id,label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`px-6 py-3 text-sm font-semibold tracking-wider transition-colors border-b-2 -mb-px ${activeTab===id ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === "description" && (
          <div className="max-w-2xl">
            <p className="text-zinc-300 leading-relaxed text-sm mb-6">{product.desc}</p>
            <div className="grid grid-cols-2 gap-4">
              {[["Material","Premium cotton blend"],["Fit","Regular/Oversized"],["Care","Machine wash 30°C"],["Origin","Made in Portugal"]].map(([k,v]) => (
                <div key={k} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                  <p className="text-zinc-500 text-xs tracking-widest uppercase mb-1">{k}</p>
                  <p className="text-white text-sm font-semibold">{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="max-w-3xl">
            <div className="flex items-center gap-6 mb-8 bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
              <div className="text-center"><div className="text-5xl font-black text-white">{product.rating}</div><Stars rating={product.rating} size="lg"/><p className="text-zinc-500 text-xs mt-1">{product.reviews} reviews</p></div>
              <div className="flex-1 space-y-2">
                {[5,4,3,2,1].map(star => (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs text-zinc-400 w-3">{star}</span>
                    <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{width:`${star===5?70:star===4?20:star===3?7:3}%`}}/>
                    </div>
                    <span className="text-xs text-zinc-500 w-6">{star===5?70:star===4?20:star===3?7:star===2?2:1}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {productReviews.map(r => (
                <div key={r.id} className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-bold text-white">{r.avatar}</div>
                    <div><p className="text-white text-sm font-semibold">{r.name}</p><p className="text-zinc-600 text-[10px]">{r.date}</p></div>
                    <div className="ml-auto"><Stars rating={r.rating}/></div>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed">{r.text}</p>
                  <p className="text-zinc-600 text-[10px] mt-3 tracking-wider">Verified purchase</p>
                </div>
              ))}
              {productReviews.length === 0 && <p className="text-zinc-600 text-sm py-4">No written reviews yet — be the first!</p>}
            </div>

            {/* Write review */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h3 className="text-white font-bold tracking-wider mb-4">WRITE A REVIEW</h3>
              {submitted ? (
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                  Review submitted — thank you!
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-400 tracking-widest uppercase mb-2 block">Your rating</label>
                    <div className="flex gap-2">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setReviewRating(s)}>
                          <svg className={`w-7 h-7 transition-colors ${s<=reviewRating?"text-amber-400":"text-zinc-700 hover:text-zinc-500"}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                        </button>
                      ))}
                    </div>
                  </div>
                  <input value={reviewName} onChange={e => setReviewName(e.target.value)} required placeholder="Your name"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"/>
                  <textarea value={reviewText} onChange={e => setReviewText(e.target.value)} required rows={4} placeholder="Share your experience with this product..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 resize-none"/>
                  <button type="submit" className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm tracking-wider hover:bg-zinc-100 transition-colors">
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {activeTab === "sizing" && (
          <div className="max-w-2xl overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-3 px-4 text-zinc-400 font-semibold">Size</th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-semibold">Chest (cm)</th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-semibold">Length (cm)</th>
                  <th className="text-left py-3 px-4 text-zinc-400 font-semibold">Shoulder (cm)</th>
                </tr>
              </thead>
              <tbody>
                {[["S","94-99","68","42"],["M","100-105","71","44"],["L","106-111","74","46"],["XL","112-117","77","48"],["XXL","118-123","80","50"]].map(([size,...rest]) => (
                  <tr key={size} className="border-b border-zinc-900 hover:bg-zinc-900/50">
                    <td className={`py-3 px-4 font-bold ${selectedSize===size?"text-white":"text-zinc-300"}`}>{size}</td>
                    {rest.map((v,i) => <td key={i} className="py-3 px-4 text-zinc-400">{v}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-zinc-500 text-xs mt-4">All measurements are in centimetres. If you're between sizes, size up for an oversized fit.</p>
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="max-w-2xl space-y-4">
            {[
              { title: "Standard Delivery", time: "3–5 business days", price: "₦2,500 (Free above ₦30,000)", icon: "🚚" },
              { title: "Express Delivery", time: "1–2 business days", price: "₦5,000", icon: "⚡" },
              { title: "Returns", time: "Within 7 days of delivery", price: "Free on first return", icon: "↩️" },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <p className="text-white font-semibold mb-1">{item.title}</p>
                  <p className="text-zinc-400 text-sm">{item.time}</p>
                  <p className="text-zinc-500 text-xs mt-1">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <div><div className="text-xs text-zinc-500 tracking-widest uppercase mb-1">More from {product.category}</div><h2 className="text-xl font-black tracking-tight">YOU MIGHT ALSO LIKE</h2></div>
            <button onClick={() => onNavigate(product.category.toUpperCase())} className="text-zinc-400 hover:text-white text-sm tracking-wider transition-colors">View all →</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map(p => <ProductCard key={p.id} product={p} onNavigate={onNavigate}/>)}
          </div>
        </section>
      )}

      {/* Mobile sticky CTA */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 px-4 pb-3 bg-gradient-to-t from-black via-black/90 to-transparent pt-6 z-20">
        <div className="flex gap-3">
          <button onClick={() => toggleWishlist(product)}
            className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all flex-shrink-0 ${wished ? "border-red-500 bg-red-500/10" : "border-zinc-700"}`}>
            <svg className={`w-5 h-5 ${wished ? "text-red-400" : "text-zinc-400"}`} fill={wished?"currentColor":"none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
          </button>
          <button onClick={handleAddToCart} disabled={product.stock === 0}
            className="flex-1 bg-white text-black py-4 rounded-xl font-black tracking-wider text-sm disabled:opacity-50">
            {product.stock === 0 ? "OUT OF STOCK" : `ADD TO CART — ${fmt(product.price * qty)}`}
          </button>
        </div>
      </div>
    </div>
  );
}
