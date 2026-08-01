import { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import PromptEditor from '../components/PromptEditor/PromptEditor';
import OutputPanel from '../components/OutputPanel/OutputPanel';
import ScoreCard from '../components/ScoreCard/ScoreCard';
import Loader from '../components/Loader/Loader';

const initialPrompt = `You are a product strategist supporting a B2B SaaS launch. Write a concise launch brief that helps the team align on positioning, target audience, and key messaging. Keep the tone clear, decisive, and customer focused.`;

export default function Dashboard() {
  const [prompt, setPrompt] = useState(initialPrompt);

  const [activeAction, setActiveAction] = useState('Evaluate');

  const [evaluation, setEvaluation] = useState(null);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_30%),linear-gradient(135deg,_rgba(2,6,23,0.98),_rgba(15,23,42,0.95))] text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-800/80 bg-slate-900/60 px-5 py-4 shadow-xl shadow-slate-950/20 backdrop-blur">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Evalio Workspace
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-100">
              Review prompt quality with high-signal insights
            </h2>
          </div>

          <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
            <Loader />
            <span>Live diagnostics ready</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1fr)]">
          <Sidebar />

          <PromptEditor
            prompt={prompt}
            onPromptChange={setPrompt}
            activeAction={activeAction}
            onActionChange={setActiveAction}
            onEvaluationComplete={setEvaluation}
          />

          <OutputPanel
            activeAction={activeAction}
            prompt={prompt}
            evaluation={evaluation}
          />
        </div>

        <ScoreCard evaluation={evaluation} />
      </main>
    </div>
  );
}