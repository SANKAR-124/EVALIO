import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import PromptEditor from '../components/PromptEditor/PromptEditor';
import OutputPanel from '../components/OutputPanel/OutputPanel';
import ScoreCard from '../components/ScoreCard/ScoreCard';
import Loader from '../components/Loader/Loader';
import ContextBar from '../components/ContextBar/ContextBar';
import { getUseCases, getAgents } from '../services/registry';


const initialPrompt = `You are a product strategist supporting a B2B SaaS launch. Write a concise launch brief that helps the team align on positioning, target audience, and key messaging. Keep the tone clear, decisive, and customer focused.`;

const demoWorkspaceName = 'demo-golden-path';

const demoEvaluation = {
  session_id: 'demo-golden-path-session',
  optimized_prompt: `You are a polished product strategist. Draft a concise launch brief for a B2B SaaS release with a clear value proposition, target audience, and proof points. Emphasize customer outcomes and use straightforward language.`,
  scorecard: {
    overall_score: 94,
    clarity: 96,
    context: 92,
    constraints: 90,
    formatting: 95,
    weaknesses: ['The prompt could be more specific about the audience segment.'],
  },
  agent_response: `## Demo Response\n\nThis placeholder response simulates a polished agent output for the Golden Path demo.\n\n- Clear structure\n- Strong positioning\n- Production-ready tone`,
};

const readPromptHistory = () => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedHistory = window.localStorage.getItem('promptHistory');
    return storedHistory ? JSON.parse(storedHistory) : [];
  } catch {
    return [];
  }
};

export default function Dashboard() {
  const [workspaceName, setWorkspaceName] = useState(demoWorkspaceName);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [promptHistory, setPromptHistory] = useState(readPromptHistory);

  const [activeAction, setActiveAction] = useState('Evaluate');
  const [sessionId, setSessionId] = useState('local-session-001');

  const [useCases, setUseCases] = useState([]);
  const [agents, setAgents] = useState([]);

  const [selectedUseCase, setSelectedUseCase] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');

  const [evaluation, setEvaluation] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');

useEffect(() => {
  const loadRegistries = async () => {
    try {
      const [useCaseData, agentData] = await Promise.all([
        getUseCases(),
        getAgents(),
      ]);

      setUseCases(useCaseData);
      setAgents(agentData);
    } catch (err) {
      console.error("Failed to load registries", err);
    }
  };

  loadRegistries();
}, []);

useEffect(() => {
  if (workspaceName) {
    localStorage.setItem('workspace', workspaceName);
  }
}, [workspaceName]);


  const handlePromptEvaluated = (nextPrompt) => {
    const normalizedPrompt = nextPrompt.trim();

    if (!normalizedPrompt) {
      return;
    }

    setPromptHistory((previousHistory) => {
      const filteredHistory = previousHistory.filter((entry) => entry !== normalizedPrompt);
      const updatedHistory = [normalizedPrompt, ...filteredHistory].slice(0, 10);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('promptHistory', JSON.stringify(updatedHistory));
      }

      return updatedHistory;
    });
  };

  const handleClearHistory = () => {
    setPromptHistory([]);

    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('promptHistory');
    }
  };

  const handleAgentChange = (nextAgent) => {
    setSelectedAgent(nextAgent);
  };

  const handleEvaluationComplete = (nextEvaluation) => {
    const nextSessionId = nextEvaluation?.session_id || sessionId;

    setSessionId(nextSessionId || 'local-session-001');
    setEvaluation({
      ...(nextEvaluation || {}),
      session_id: nextSessionId || '',
      selected_agent: selectedAgent || '',
    });
  };

  const handleNewSession = () => {
    setSessionId('');
    setPrompt('');
    setEvaluation(null);
    setError('');
    setLoading(false);
    setActiveAction('Evaluate');
  };

  const handleLoadDemoSession = () => {
    setWorkspaceName(demoWorkspaceName);
    setSessionId(demoEvaluation.session_id);
    setPrompt(demoEvaluation.optimized_prompt);
    setEvaluation(demoEvaluation);
    setError('');
    setLoading(false);
    setActiveAction('Evaluate');
    setSelectedAgent('Claude');
    setSelectedUseCase('UI / Frontend Development');
  };

  const formattedSessionId = sessionId
    ? `${sessionId.slice(0, 16)}${sessionId.length > 16 ? '…' : ''}`
    : 'Pending';

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.14),_transparent_30%),linear-gradient(135deg,_rgba(2,6,23,0.98),_rgba(15,23,42,0.95))] text-slate-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {workspaceName === demoWorkspaceName ? (
          <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 shadow-lg shadow-emerald-950/20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-emerald-200">Golden Path Demo</p>
                <p className="text-sm text-emerald-100/80">This workspace is preconfigured for the hackathon demonstration.</p>
              </div>
              <button
                type="button"
                onClick={handleLoadDemoSession}
                className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20"
              >
                Load Demo Session
              </button>
            </div>
          </div>
        ) : null}

        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-slate-800/80 bg-slate-900/60 px-5 py-4 shadow-xl shadow-slate-950/20 backdrop-blur">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
              Evalio Workspace
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-100">
              Review prompt quality with high-signal insights
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
              <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                Current Session
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-medium text-slate-100">{formattedSessionId}</span>
                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
                  Active
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleNewSession}
              className="rounded-full border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
            >
              New Session
            </button>

            <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-300">
              <Loader />
              <span>Live diagnostics ready</span>
            </div>
          </div>
        </div>

        <ContextBar
          useCases={useCases}
          agents={agents}
          selectedUseCase={selectedUseCase}
          selectedAgent={selectedAgent}
          onUseCaseChange={setSelectedUseCase}
          onAgentChange={handleAgentChange}
        />
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_minmax(0,1fr)]">
          <Sidebar
            historyItems={promptHistory}
            onPromptSelect={setPrompt}
            onClearHistory={handleClearHistory}
          />

          <PromptEditor
            prompt={prompt}
            onPromptChange={setPrompt}
            activeAction={activeAction}
            onActionChange={setActiveAction}
            onEvaluationComplete={handleEvaluationComplete}
            onPromptEvaluated={handlePromptEvaluated}
            loading={loading}
            setLoading={setLoading}
            setError={setError}
            selectedAgent={selectedAgent}
            selectedUseCase={selectedUseCase}
          />

          <OutputPanel
            activeAction={activeAction}
            prompt={prompt}
            evaluation={evaluation}
            error={error}
            loading={loading}
            selectedAgent={selectedAgent}
          />
        </div>

        <ScoreCard evaluation={evaluation} />
      </main>
    </div>
  );
}