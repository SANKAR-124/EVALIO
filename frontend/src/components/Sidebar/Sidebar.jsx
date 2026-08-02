import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Clock3, LogOut, Plus } from 'lucide-react';

export default function Sidebar({ recentSessions = [], onSessionSelect, onNewSession, workspaceName }) {
  const [sessionsExpanded, setSessionsExpanded] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    setLoggingOut(true);
    window.setTimeout(() => setLoggingOut(false), 1500);
  };

  return (
    <motion.aside
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex h-full flex-col rounded-2xl border border-stone-800 bg-stone-950/60 p-3"
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-sm font-semibold text-stone-200">Sessions</p>
        <button
          type="button"
          onClick={onNewSession}
          aria-label="New session"
          className="flex h-7 w-7 items-center justify-center rounded-lg border border-stone-800 bg-stone-900/80 text-stone-300 transition hover:border-amber-500/30 hover:text-amber-300"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="rounded-xl border border-stone-800/80 bg-stone-900/50 p-2.5">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-stone-400">
            <Clock3 className="h-3.5 w-3.5" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">Recent</span>
          </div>
          <button
            type="button"
            onClick={() => setSessionsExpanded((previous) => !previous)}
            aria-label={sessionsExpanded ? 'Collapse recent sessions' : 'Expand recent sessions'}
            className="rounded-md p-1 text-stone-500 transition hover:bg-stone-800/80 hover:text-stone-200"
          >
            {sessionsExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {sessionsExpanded ? (
          <div
            className="min-h-[70px] resize-y space-y-1.5 overflow-y-auto overflow-x-hidden pr-1"
            style={{ height: '360px', maxHeight: '640px' }}
          >
            {recentSessions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-stone-800 bg-stone-950/60 p-2.5 text-xs text-stone-500">
                No sessions yet.
              </div>
            ) : (
              recentSessions.map((session) => (
                <button
                  key={session.session_id}
                  type="button"
                  onClick={() => onSessionSelect?.(session.session_id)}
                  className="w-full rounded-lg border border-stone-800/80 bg-stone-950/60 p-2.5 text-left transition hover:border-amber-500/30 hover:bg-stone-900"
                >
                  <p className="truncate text-sm font-medium text-stone-200">{session.title || 'Untitled Session'}</p>
                  <p className="mt-1 text-[10px] text-stone-500">{new Date(session.updated_at).toLocaleString()}</p>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>

      <div className="mt-auto space-y-2 pt-3">
        <div className="space-y-1 rounded-xl border border-stone-800/80 bg-stone-950/60 p-2.5 text-[11px] text-stone-500">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            GLM 4.7 <span className="text-stone-600">Primary</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Groq <span className="text-stone-600">Backup</span>
          </div>
          <div className="pt-0.5 text-stone-600">Workspace: {workspaceName || '—'}</div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-800 bg-stone-950/80 px-4 py-2.5 text-sm font-medium text-stone-300 transition hover:border-stone-700 hover:bg-stone-900 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? 'Logging out…' : 'Logout'}
        </button>
      </div>
    </motion.aside>
  );
}
