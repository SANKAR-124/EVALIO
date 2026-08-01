import { motion } from 'framer-motion';
import {
  Clock3,
  History,
  LayoutGrid,
  MessageSquareText,
  Plus,
  Settings2,
  Sparkles,
  Star,
  TerminalSquare,
} from 'lucide-react';

export default function Sidebar({ historyItems = [], onPromptSelect, onClearHistory }) {
  const formatPreview = (prompt) => {
    const trimmedPrompt = prompt.trim();
    return trimmedPrompt.length > 50 ? `${trimmedPrompt.slice(0, 50)}…` : trimmedPrompt;
  };

  const templateItems = ['Backend API', 'React Component', 'SQL Query', 'Code Review', 'Machine Learning'];
  const recentSessions = ['Session #1', 'Session #2', 'Session #3'];
  const favorites = ['Launch Brief', 'Bug Triage', 'UX Review'];
  const settingsItems = ['Theme', 'Workspace', 'Preferences'];

  const sectionBaseClasses = 'rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3';

  return (
    <motion.aside
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl shadow-slate-950/20 backdrop-blur"
    >
      <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
        <Plus className="h-4 w-4" />
        New Prompt
      </button>

      <div className="mt-5 space-y-3">
        <motion.section whileHover={{ y: -2, scale: 1.01 }} className={sectionBaseClasses}>
          <div className="mb-2 flex items-center gap-2">
            <History className="h-4 w-4 text-cyan-400" />
            <p className="text-sm font-semibold text-slate-200">Prompt History</p>
          </div>

          <div className="max-h-[220px] space-y-2 overflow-y-auto pr-1">
            {historyItems.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/60 p-2.5 text-sm text-slate-500">
                No prompt history yet.
              </div>
            ) : (
              historyItems.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onPromptSelect?.(item)}
                  className="w-full rounded-xl border border-slate-800/80 bg-slate-900/60 p-2.5 text-left transition hover:border-slate-700 hover:bg-slate-800/80"
                >
                  <p className="text-sm font-medium text-slate-200">{formatPreview(item)}</p>
                  <p className="mt-1 text-[11px] text-slate-500">Click to restore</p>
                </button>
              ))
            )}
          </div>

          {historyItems.length > 0 ? (
            <button
              type="button"
              onClick={onClearHistory}
              className="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900/70 px-2.5 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-700 hover:text-slate-100"
            >
              Clear History
            </button>
          ) : null}
        </motion.section>

        <motion.section whileHover={{ y: -2, scale: 1.01 }} className={sectionBaseClasses}>
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <p className="text-sm font-semibold text-slate-200">Templates</p>
          </div>

          <div className="space-y-2">
            {templateItems.map((template) => (
              <button
                key={template}
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 px-2.5 py-2 text-left text-sm text-slate-300 transition hover:border-slate-700 hover:bg-slate-800/80"
              >
                <span>{template}</span>
                <LayoutGrid className="h-3.5 w-3.5 text-slate-500" />
              </button>
            ))}
          </div>
        </motion.section>

        <motion.section whileHover={{ y: -2, scale: 1.01 }} className={sectionBaseClasses}>
          <div className="mb-2 flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-emerald-400" />
            <p className="text-sm font-semibold text-slate-200">Recent Sessions</p>
          </div>

          <div className="space-y-2">
            {recentSessions.map((session) => (
              <div key={session} className="rounded-xl border border-slate-800/80 bg-slate-900/60 px-2.5 py-2 text-sm text-slate-400">
                {session}
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section whileHover={{ y: -2, scale: 1.01 }} className={sectionBaseClasses}>
          <div className="mb-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            <p className="text-sm font-semibold text-slate-200">Favorites</p>
          </div>

          <div className="space-y-2">
            {favorites.map((favorite) => (
              <div key={favorite} className="rounded-xl border border-slate-800/80 bg-slate-900/60 px-2.5 py-2 text-sm text-slate-400">
                {favorite}
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section whileHover={{ y: -2, scale: 1.01 }} className={sectionBaseClasses}>
          <div className="mb-2 flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-slate-400" />
            <p className="text-sm font-semibold text-slate-200">Settings</p>
          </div>

          <div className="space-y-2">
            {settingsItems.map((setting) => (
              <button
                key={setting}
                type="button"
                className="flex w-full items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 px-2.5 py-2 text-sm text-slate-300 transition hover:border-slate-700 hover:bg-slate-800/80"
              >
                <span>{setting}</span>
                <MessageSquareText className="h-3.5 w-3.5 text-slate-500" />
              </button>
            ))}
          </div>
        </motion.section>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3 text-sm leading-6 text-slate-400">
        Keep prompts concise, context-rich, and easy to score.
      </div>
    </motion.aside>
  );
}