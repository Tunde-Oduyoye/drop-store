export default function EmptyState({ icon, title, description, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-5">
        <span className="text-2xl opacity-40">{icon}</span>
      </div>
      <h3 className="text-white font-semibold text-[15px] mb-2">{title}</h3>
      <p className="text-zinc-600 text-[13px] max-w-xs leading-relaxed mb-6">{description}</p>
      {action && (
        <button onClick={onAction} className="flex items-center gap-2 bg-lime-400 text-black px-5 py-2.5 rounded-xl font-bold text-[13px] hover:bg-lime-500 transition-colors">
          {action}
        </button>
      )}
    </div>
  );
}
