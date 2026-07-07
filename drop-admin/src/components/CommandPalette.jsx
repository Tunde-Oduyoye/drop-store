import { useState, useEffect, useRef } from "react";

const COMMANDS = [
  { id: "DASHBOARD", label: "Go to Dashboard", group: "Navigate", keys: "G D" },
  { id: "PRODUCTS", label: "Go to Products", group: "Navigate", keys: "G P" },
  { id: "ORDERS", label: "Go to Orders", group: "Navigate", keys: "G O" },
  { id: "SETTINGS", label: "Go to Settings", group: "Navigate", keys: "G S" },
];

export default function CommandPalette({ open, onClose, onNavigate }) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);

  const filtered = COMMANDS.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => { setActiveIdx(0); }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && filtered[activeIdx]) {
      onNavigate(filtered[activeIdx].id);
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"/>
      <div className="relative w-full max-w-lg bg-[#131316] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-slide_in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
          <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-white text-[14px] placeholder-zinc-600 focus:outline-none"
          />
          <kbd className="text-[10px] font-mono text-zinc-600 bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/[0.06]">ESC</kbd>
        </div>
        <div className="max-h-72 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-8">No matching commands</p>
          ) : (
            <>
              <div className="text-zinc-600 text-[10px] font-semibold tracking-widest uppercase px-4 pt-1 pb-1.5">Navigate</div>
              {filtered.map((cmd, i) => (
                <button
                  key={cmd.id}
                  onClick={() => { onNavigate(cmd.id); onClose(); }}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-[13.5px] transition-colors ${i === activeIdx ? "bg-white/[0.06] text-white" : "text-zinc-400"}`}
                >
                  <span>{cmd.label}</span>
                  <kbd className="text-[10px] font-mono text-zinc-600">{cmd.keys}</kbd>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
