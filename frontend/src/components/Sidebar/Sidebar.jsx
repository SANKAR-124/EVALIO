import { History, Plus, Settings2 } from 'lucide-react';

const historyItems = [
  { title: 'Launch Brief', meta: 'Updated 2m ago' },
  { title: 'Feature QA Prompt', meta: 'Reviewed yesterday' },
  { title: 'Support Triage Flow', meta: 'Archived' },
];

export default function Sidebar() {
  return (
    <aside className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl shadow-slate-950/20 backdrop-blur">
      <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
        <Plus className="h-4 w-4" />
        New Prompt
      </button>

      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-200">Prompt History</p>
          <button className="rounded-full p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-100">
            <Settings2 className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2">
          {historyItems.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3 transition hover:border-slate-700"
            >
              <div className="flex items-start gap-2">
                <History className="mt-0.5 h-4 w-4 text-cyan-400" />
                <div>
                  <p className="text-sm font-medium text-slate-200">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.meta}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
        <p className="text-sm font-semibold text-slate-200">Workspace Focus</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Keep prompts concise, context-rich, and easy to score.
        </p>
      </div>
    </aside>
  );
}