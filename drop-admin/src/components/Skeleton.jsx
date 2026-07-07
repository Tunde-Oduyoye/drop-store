// Skeleton loader components for every data-fetching state
export function SkeletonCard({ className = "" }) {
  return <div className={`animate-pulse bg-white/[0.04] rounded-2xl ${className}`}/>;
}

export function SkeletonText({ width = "w-full", height = "h-3", className = "" }) {
  return <div className={`animate-pulse bg-white/[0.04] rounded-md ${width} ${height} ${className}`}/>;
}

export function SkeletonRow() {
  return (
    <tr className="border-b border-white/[0.04]">
      {[1,2,3,4,5,6].map(i => (
        <td key={i} className="py-4 px-5">
          <div className="animate-pulse bg-white/[0.04] rounded-md h-3" style={{width:`${40 + Math.random()*40}%`}}/>
        </td>
      ))}
    </tr>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-6 sm:p-8 max-w-[1400px] space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-32 bg-white/[0.04] rounded-lg"/>
          <div className="h-4 w-48 bg-white/[0.04] rounded-md"/>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {[...Array(5)].map((_,i) => (
          <div key={i} className="bg-[#0E0E10] border border-white/[0.06] rounded-2xl p-4 space-y-3">
            <div className="h-3 w-20 bg-white/[0.04] rounded-md"/>
            <div className="h-8 w-16 bg-white/[0.04] rounded-lg"/>
            <div className="h-8 w-full bg-white/[0.04] rounded-md"/>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-[#0E0E10] border border-white/[0.06] rounded-2xl p-5 h-56"/>
        <div className="bg-[#0E0E10] border border-white/[0.06] rounded-2xl p-5 h-56"/>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 6, cols = 6 }) {
  return (
    <>
      {[...Array(rows)].map((_,i) => (
        <tr key={i} className="border-b border-white/[0.04]">
          {[...Array(cols)].map((_,j) => (
            <td key={j} className="py-4 px-5">
              <div className="animate-pulse bg-white/[0.04] rounded-md h-3" style={{width: j === 0 ? "80%" : j === cols-1 ? "40%" : "60%"}}/>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
