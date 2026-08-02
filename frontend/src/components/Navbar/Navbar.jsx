import { Loader2, Sparkles, Zap } from 'lucide-react';

export default function Navbar({ contextLabel, onEvaluate, loading, evaluateDisabled }) {
  return (
    <header className="border-b border-stone-800/80 bg-stone-950/90 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-900/30">
            <Sparkles className="h-4.5 w-4.5 text-stone-950" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-stone-100">Evalio</h1>
        </div>

        <div className="flex items-center gap-3">
          {contextLabel ? (
            <div className="hidden items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-amber-200 sm:flex">
              <Zap className="h-3.5 w-3.5" />
              {contextLabel}
            </div>
          ) : null}

          <button
            type="button"
            onClick={onEvaluate}
            disabled={evaluateDisabled || loading}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-900/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Evaluating…
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Evaluate
                <span className="ml-1 rounded-md bg-stone-950/20 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide">
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
