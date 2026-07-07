import { useAdmin } from "../context/AdminContext";

export default function Toast() {
  const { toast } = useAdmin();
  if (!toast) return null;

  const styles = {
    success: "bg-[#131316] border-lime-400/30 text-white",
    error: "bg-[#131316] border-red-500/30 text-white",
    info: "bg-[#131316] border-white/10 text-white",
  };
  const dotColor = { success: "bg-lime-400", error: "bg-red-500", info: "bg-zinc-500" };

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[110] border ${styles[toast.type] || styles.success} px-4 py-3 rounded-xl shadow-2xl shadow-black/50 text-[13px] font-medium flex items-center gap-2.5 animate-slide_in`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor[toast.type] || dotColor.success}`}/>
      {toast.msg}
    </div>
  );
}
