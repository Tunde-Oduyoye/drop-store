import { useState, useMemo } from "react";
import { ALL_PRODUCTS, CATEGORIES, fmt } from "../data/products";
import { ProductCard } from "../components/Shared";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Best Rated", value: "rating" },
  { label: "Most Reviewed", value: "reviews" },
];

export default function CollectionPage({ onNavigate, filterCategory = null }) {
  const [selectedCategories, setSelectedCategories] = useState(filterCategory ? [filterCategory] : []);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQ, setSearchQ] = useState("");

  const allSizes = [...new Set(ALL_PRODUCTS.flatMap(p => p.sizes))];

  const toggleFilter = (list, setList, val) => {
    setList(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  const filtered = useMemo(() => {
    let products = [...ALL_PRODUCTS];
    if (selectedCategories.length) products = products.filter(p => selectedCategories.includes(p.category));
    if (selectedSizes.length) products = products.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
    products = products.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (searchQ) products = products.filter(p => p.name.toLowerCase().includes(searchQ.toLowerCase()));
    switch (sortBy) {
      case "price_asc": return [...products].sort((a,b) => a.price - b.price);
      case "price_desc": return [...products].sort((a,b) => b.price - a.price);
      case "rating": return [...products].sort((a,b) => b.rating - a.rating);
      case "reviews": return [...products].sort((a,b) => b.reviews - a.reviews);
      default: return products;
    }
  }, [selectedCategories, selectedSizes, priceRange, sortBy, searchQ]);

  const clearFilters = () => { setSelectedCategories([]); setSelectedSizes([]); setPriceRange([0,100000]); setSearchQ(""); };
  const hasFilters = selectedCategories.length || selectedSizes.length || searchQ || priceRange[0] > 0 || priceRange[1] < 100000;

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="text-white text-xs font-bold tracking-widest mb-3">SEARCH</h3>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search products..."
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"/>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-white text-xs font-bold tracking-widest mb-3">CATEGORY</h3>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
              <div onClick={() => toggleFilter(selectedCategories, setSelectedCategories, cat.name)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${selectedCategories.includes(cat.name) ? "bg-white border-white" : "border-zinc-600 group-hover:border-zinc-400"}`}>
                {selectedCategories.includes(cat.name) && <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
              </div>
              <span className={`text-sm transition-colors ${selectedCategories.includes(cat.name) ? "text-white font-semibold" : "text-zinc-400 group-hover:text-white"}`}>
                {cat.icon} {cat.name} <span className="text-zinc-600">({cat.count})</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="text-white text-xs font-bold tracking-widest mb-3">SIZE</h3>
        <div className="flex flex-wrap gap-2">
          {allSizes.slice(0,12).map(size => (
            <button key={size} onClick={() => toggleFilter(selectedSizes, setSelectedSizes, size)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${selectedSizes.includes(size) ? "bg-white text-black border-white" : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white"}`}>
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="text-white text-xs font-bold tracking-widest mb-3">PRICE RANGE</h3>
        <div className="space-y-3">
          <input type="range" min="0" max="100000" step="1000" value={priceRange[1]}
            onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-white"/>
          <div className="flex justify-between text-xs text-zinc-400">
            <span>{fmt(priceRange[0])}</span><span>{fmt(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {hasFilters && (
        <button onClick={clearFilters} className="w-full border border-zinc-700 text-zinc-400 py-2.5 rounded-xl text-sm hover:border-zinc-500 hover:text-white transition-colors">
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 md:pb-10">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs text-zinc-500 tracking-widest uppercase mb-1">All Products</div>
        <h1 className="text-3xl font-black tracking-tight">{selectedCategories.length === 1 ? selectedCategories[0].toUpperCase() : "COLLECTION"}</h1>
        <p className="text-zinc-500 text-sm mt-1">{filtered.length} products</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <FilterSidebar/>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <button onClick={() => setFiltersOpen(true)} className="lg:hidden flex items-center gap-2 border border-zinc-700 text-zinc-300 px-4 py-2.5 rounded-xl text-sm hover:border-zinc-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
              Filters {hasFilters && <span className="bg-white text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{selectedCategories.length + selectedSizes.length}</span>}
            </button>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="ml-auto bg-zinc-900 border border-zinc-700 text-white text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-zinc-500 cursor-pointer">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Active filter pills */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map(c => (
                <span key={c} className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded-full">
                  {c}
                  <button onClick={() => toggleFilter(selectedCategories, setSelectedCategories, c)} className="text-zinc-500 hover:text-white">×</button>
                </span>
              ))}
              {selectedSizes.map(s => (
                <span key={s} className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded-full">
                  Size: {s}
                  <button onClick={() => toggleFilter(selectedSizes, setSelectedSizes, s)} className="text-zinc-500 hover:text-white">×</button>
                </span>
              ))}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-6xl mb-4 opacity-20">🔍</div>
              <p className="text-zinc-400 font-semibold text-lg">No products found</p>
              <p className="text-zinc-600 text-sm mt-1 mb-6">Try adjusting your filters</p>
              <button onClick={clearFilters} className="bg-white text-black px-6 py-3 rounded-xl font-bold text-sm">Clear Filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map(p => <ProductCard key={p.id} product={p} onNavigate={onNavigate}/>)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <>
        <div className={`fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 lg:hidden ${filtersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={() => setFiltersOpen(false)}/>
        <div className={`fixed left-0 top-0 h-full w-80 max-w-[90vw] bg-zinc-950 border-r border-zinc-800 z-50 flex flex-col transition-transform duration-300 lg:hidden ${filtersOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
            <span className="text-white font-bold tracking-wider">FILTERS</span>
            <button onClick={() => setFiltersOpen(false)} className="text-zinc-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6"><FilterSidebar/></div>
          <div className="px-6 py-4 border-t border-zinc-800">
            <button onClick={() => setFiltersOpen(false)} className="w-full bg-white text-black py-3.5 rounded-xl font-bold text-sm">
              Show {filtered.length} Products
            </button>
          </div>
        </div>
      </>
    </div>
  );
}
