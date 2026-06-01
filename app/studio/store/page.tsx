import { ShoppingCart, HardHat } from "lucide-react";

export default function StoreDashboard() {
  return (
    <div className="space-y-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="bg-emerald-500/10 p-6 rounded-full border border-emerald-500/20 mb-4 animate-pulse">
        <ShoppingCart className="w-16 h-16 text-emerald-500" />
      </div>
      <h1 className="text-4xl font-black text-white tracking-tight">Store Module</h1>
      <p className="text-zinc-400 text-lg max-w-md">
        The e-commerce and hardware catalog module is currently under construction.
      </p>
      <div className="flex items-center gap-2 mt-8 text-xs font-mono bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full text-zinc-500 uppercase tracking-widest">
        <HardHat className="w-4 h-4" /> Expected in Phase 4
      </div>
    </div>
  );
}
