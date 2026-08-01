import { BadgeCheck, Sparkles, PanelsTopLeft } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-500 shadow-lg shadow-cyan-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold tracking-tight text-slate-100">Evalio</h1>
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
                Prompt IDE
              </span>
            </div>
            <p className="text-sm text-slate-400">AI-powered prompt evaluation workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-300">
          <PanelsTopLeft className="h-4 w-4 text-cyan-400" />
          <span className="font-medium text-slate-200">Northstar Launch</span>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300">
            <BadgeCheck className="h-3.5 w-3.5" />
            Workspace
          </span>
        </div>
      </div>
    </header>
  );
}