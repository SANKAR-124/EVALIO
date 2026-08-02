import { Loader2, Sparkles, Zap, Shield } from 'lucide-react';

export default function Navbar({ contextLabel, onEvaluate, loading, evaluateDisabled }) {
  return (
    <header className="border-b border-stone-800/80 bg-stone-950/90 py-2.5 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        {/* Brand logo */}
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-amber-500 fill-amber-500/20" />
          <span className="text-base font-bold tracking-tight text-amber-500">Evalio</span>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {contextLabel && (
            <div className="flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-[11px] font-semibold text-amber-300">
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>{contextLabel}</span>
            </div>
          )}


          <button
            type="button"
            onClick={onEvaluate}
            disabled={evaluateDisabled || loading}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-stone-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5 fill-current" />
                <span>Evaluate</span>
                <span className="ml-1 rounded bg-stone-950/15 px-1 py-0.5 text-[9px] font-bold text-stone-900">
                  ⌘⏎
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
