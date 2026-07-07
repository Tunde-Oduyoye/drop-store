import { useState, useEffect, useRef } from "react";
import { api } from "../lib/api";
import { useAdmin } from "../context/AdminContext";

const fmt = (n) => `₦${Number(n).toLocaleString()}`;
const CATEGORIES = ["Tops","Jeans","Caps","Shoes","Watches","Belts","Boxers"];
const BADGES = ["","New","Sale","Limited","🔥 Hot"];
const BLANK = { name:"", slug:"", description:"", category:"Tops", price:"", oldPrice:"", stock:"", badge:"", colors:"#1a1a1a", sizes:"S,M,L,XL" };

const BADGE_STYLE = {
  "New": "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  "Sale": "bg-red-400/10 text-red-400 border-red-400/20",
  "Limited": "bg-purple-400/10 text-purple-400 border-purple-400/20",
  "🔥 Hot": "bg-orange-400/10 text-orange-400 border-orange-400/20",
};

function ImageUploader({ images, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const inputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files.length) return;
    setUploading(true);
    setUploadError("");
    const newUrls = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 5 * 1024 * 1024) { setUploadError("Each image must be under 5MB"); continue; }

      try {
        // Convert to base64
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        const { url } = await api.upload.image(base64, file.name);
        newUrls.push(url);
      } catch (err) {
        // If Cloudinary isn't configured yet, store base64 preview locally
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
        newUrls.push(base64);
        setUploadError("Cloudinary not configured — images stored locally. See .env.example to set it up.");
      }
    }

    onChange([...images, ...newUrls]);
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeImage = (idx) => onChange(images.filter((_, i) => i !== idx));

  return (
    <div>
      <label className="text-[11px] text-zinc-500 font-semibold tracking-wider uppercase block mb-2">
        Product images
      </label>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-3">
          {images.map((url, i) => (
            <div key={i} className="relative aspect-square group rounded-xl overflow-hidden border border-white/[0.08]">
              <img src={url} alt="" className="w-full h-full object-cover"/>
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 text-[9px] font-bold bg-lime-400 text-black px-1.5 py-0.5 rounded-md">MAIN</span>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/70 text-white rounded-full text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
              >×</button>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-white/[0.08] rounded-xl p-5 text-center cursor-pointer hover:border-lime-400/30 hover:bg-lime-400/[0.02] transition-all"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-zinc-400 text-[13px]">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Uploading...
          </div>
        ) : (
          <>
            <svg className="w-6 h-6 text-zinc-600 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
            </svg>
            <p className="text-zinc-400 text-[13px] font-medium">Drop images here or <span className="text-lime-400">browse</span></p>
            <p className="text-zinc-600 text-[11px] mt-1">PNG, JPG, WEBP — max 5MB each</p>
          </>
        )}
      </div>
      {uploadError && <p className="text-amber-400 text-[11px] mt-2">{uploadError}</p>}
    </div>
  );
}

function ProductField({ label, name, form, onChange, type = "text", placeholder = "", required = false }) {
  return (
    <div>
      <label className="text-[11px] text-zinc-500 font-semibold tracking-wider uppercase block mb-1.5">{label}</label>
      <input type={type} value={form[name] ?? ""} onChange={onChange(name)} required={required} placeholder={placeholder}
        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-white text-[13.5px] placeholder-zinc-700 focus:outline-none focus:border-lime-400/40 transition-colors"/>
    </div>
  );
}

export default function ProductsPage() {
  const { showToast } = useAdmin();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [images, setImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const load = () => {
    setLoading(true);
    api.products.list({ limit: 100 })
      .then(({ products }) => setProducts(products))
      .catch(err => showToast(err.message, "error"))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setForm(BLANK); setImages([]); setEditingId(null);
    setFormError(""); setModalOpen(true);
  };

  const openEdit = (p) => {
    setForm({
      name: p.name, slug: p.slug, description: p.description || "",
      category: p.category, price: p.price, oldPrice: p.oldPrice || "",
      stock: p.stock, badge: p.badge || "",
      colors: p.colors.join(", "), sizes: p.sizes.join(", "),
    });
    setImages(p.images || []);
    setEditingId(p.id);
    setFormError("");
    setModalOpen(true);
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: form.description.trim(),
        category: form.category,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        stock: Number(form.stock),
        badge: form.badge || null,
        colors: form.colors.split(",").map(c => c.trim()).filter(Boolean),
        sizes: form.sizes.split(",").map(s => s.trim()).filter(Boolean),
        images,
      };
      if (editingId) {
        await api.products.update(editingId, payload);
        showToast("Product updated");
      } else {
        await api.products.create(payload);
        showToast("Product created");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.products.remove(id);
      setDeleteConfirmId(null);
      showToast("Product deleted", "info");
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || p.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-6 sm:p-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white text-[22px] font-bold tracking-tight">Products</h1>
          <p className="text-zinc-600 text-[13px] mt-0.5 font-mono">{products.length} items in catalog</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-lime-400 text-black px-4 py-2.5 rounded-xl font-bold text-[13px] hover:bg-lime-500 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
            className="w-full bg-[#0E0E10] border border-white/[0.06] rounded-xl pl-9 pr-4 py-2.5 text-white text-[13px] placeholder-zinc-700 focus:outline-none focus:border-white/20 transition-colors"/>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {["", ...CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setCatFilter(cat)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors border ${catFilter === cat ? "border-lime-400/30 bg-lime-400/10 text-lime-400" : "border-white/[0.06] bg-white/[0.02] text-zinc-500 hover:text-zinc-300"}`}>
              {cat || "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0E0E10] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px] min-w-[700px]">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Product","Category","Price","Stock","Badge",""].map(h => (
                  <th key={h} className={`py-3 px-5 text-[10px] font-semibold tracking-widest uppercase text-zinc-600 ${h === "" ? "text-right" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr><td colSpan={6} className="py-16 text-center text-zinc-600 font-mono text-xs">LOADING PRODUCTS</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-16 text-center text-zinc-600 text-sm">No products found</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-white/[0.06]"/>
                      ) : (
                        <div className="w-9 h-9 rounded-lg flex-shrink-0 border border-white/[0.06]" style={{background:`radial-gradient(ellipse,${p.colors?.[0]}44,#111)`}}/>
                      )}
                      <div>
                        <p className="text-white font-medium leading-tight">{p.name}</p>
                        <p className="text-zinc-600 text-[11px] font-mono mt-0.5">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-zinc-400">{p.category}</td>
                  <td className="py-3.5 px-5 font-mono">
                    <span className="text-white font-semibold">{fmt(p.price)}</span>
                    {p.oldPrice && <span className="text-zinc-600 text-[11px] line-through ml-2">{fmt(p.oldPrice)}</span>}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className={`font-mono font-semibold ${p.stock <= 5 ? "text-amber-400" : p.stock <= 0 ? "text-red-400" : "text-zinc-300"}`}>{p.stock}</span>
                    {p.stock <= 5 && p.stock > 0 && <span className="ml-1.5 text-[10px] text-amber-400/70">LOW</span>}
                    {p.stock === 0 && <span className="ml-1.5 text-[10px] text-red-400/70">OUT</span>}
                  </td>
                  <td className="py-3.5 px-5">
                    {p.badge
                      ? <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${BADGE_STYLE[p.badge] || "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>{p.badge}</span>
                      : <span className="text-zinc-700">—</span>}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(p)} className="text-zinc-400 hover:text-white text-[12px] font-semibold transition-colors">Edit</button>
                      <button onClick={() => setDeleteConfirmId(p.id)} className="text-zinc-600 hover:text-red-400 text-[12px] font-semibold transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirm */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirmId(null)}>
          <div className="bg-[#131316] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.007v.008H12v-.008z"/></svg>
            </div>
            <h3 className="text-white font-bold text-[15px] mb-2">Delete product?</h3>
            <p className="text-zinc-500 text-[13px] mb-6">This cannot be undone. The product will be permanently removed from your catalog.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 border border-white/[0.08] text-zinc-400 py-2.5 rounded-xl text-[13px] font-semibold hover:border-white/20 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirmId)} className="flex-1 bg-red-500/10 border border-red-500/30 text-red-400 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-red-500/20 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Product form modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#131316] border border-white/[0.08] rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06] flex-shrink-0">
              <h2 className="text-white font-bold text-[15px]">{editingId ? "Edit product" : "New product"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-zinc-600 hover:text-zinc-300 transition-colors p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5">
              {formError && (
                <div className="bg-red-500/[0.08] border border-red-500/20 text-red-400 text-[13px] rounded-xl px-3.5 py-3 mb-4">{formError}</div>
              )}
              <form id="product-form" onSubmit={handleSave}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Left column */}
                  <div className="space-y-4">
                    <ProductField label="Product name" name="name" form={form} onChange={set} required placeholder="Void Oversized Tee"/>
                    <ProductField label="Slug (auto if blank)" name="slug" form={form} onChange={set} placeholder="void-oversized-tee"/>
                    <div>
                      <label className="text-[11px] text-zinc-500 font-semibold tracking-wider uppercase block mb-1.5">Description</label>
                      <textarea value={form.description} onChange={set("description")} rows={4} required placeholder="Describe the product..."
                        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-white text-[13.5px] placeholder-zinc-700 focus:outline-none focus:border-lime-400/40 transition-colors resize-none"/>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-zinc-500 font-semibold tracking-wider uppercase block mb-1.5">Category</label>
                        <select value={form.category} onChange={set("category")} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-white text-[13.5px] focus:outline-none focus:border-lime-400/40 transition-colors">
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-500 font-semibold tracking-wider uppercase block mb-1.5">Badge</label>
                        <select value={form.badge} onChange={set("badge")} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-white text-[13.5px] focus:outline-none focus:border-lime-400/40 transition-colors">
                          {BADGES.map(b => <option key={b} value={b}>{b || "None"}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <ProductField label="Price (₦)" name="price" type="number" form={form} onChange={set} required placeholder="12500"/>
                      <ProductField label="Old Price" name="oldPrice" type="number" form={form} onChange={set} placeholder="15000"/>
                      <ProductField label="Stock" name="stock" type="number" form={form} onChange={set} required placeholder="20"/>
                    </div>
                    <ProductField label="Colors (hex, comma-sep)" name="colors" form={form} onChange={set} placeholder="#1a1a1a, #f5f5f5"/>
                    <ProductField label="Sizes (comma-sep)" name="sizes" form={form} onChange={set} placeholder="S, M, L, XL"/>
                  </div>

                  {/* Right column — image upload */}
                  <div>
                    <ImageUploader images={images} onChange={setImages}/>
                    {images.length > 0 && (
                      <p className="text-zinc-600 text-[11px] mt-2">First image is the main product photo. Drag to reorder (coming soon).</p>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-white/[0.06] flex gap-3 flex-shrink-0">
              <button type="button" onClick={() => setModalOpen(false)} className="flex-1 border border-white/[0.08] text-zinc-400 py-2.5 rounded-xl text-[13px] font-semibold hover:border-white/20 transition-colors">Cancel</button>
              <button type="submit" form="product-form" disabled={saving} className="flex-1 bg-lime-400 text-black py-2.5 rounded-xl text-[13px] font-bold hover:bg-lime-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? (
                  <><svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Saving</>
                ) : editingId ? "Save changes" : "Create product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
