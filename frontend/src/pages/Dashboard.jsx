import { useEffect, useState } from 'react';
import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import PromptEditor from '../components/PromptEditor/PromptEditor';
import OutputPanel from '../components/OutputPanel/OutputPanel';
import ContextBar from '../components/ContextBar/ContextBar';
import { getUseCases, getAgents } from '../services/registry';
import { listSessions, getSessionDetail } from '../services/session';
import { evaluatePrompt } from '../services/evaluate';
import { scanPrompt } from '../services/scan';

const initialPrompt = `You are a product strategist supporting a B2B SaaS launch. Write a concise launch brief that helps the team align on positioning, target audience, and key messaging. Keep the tone clear, decisive, and customer focused.`;

const demoWorkspaceName = 'demo-golden-path';

const demoEvaluation = {
  session_id: 'demo-golden-path-session',
  optimized_prompt: `<role>\n  Senior Product Strategist\n</role>\n\n<instructions>\n  Draft a concise launch brief for a B2B SaaS release with a clear value proposition, target audience, and proof points. Emphasize customer outcomes and use straightforward language.\n</instructions>`,
  scorecard: {
    overall_score: 94,
    clarity: 96,
    context: 92,
    constraints: 90,
    formatting: 95,
    weaknesses: ['The prompt could be more specific about the audience segment.'],
  },
  agent_response: `## Demo Response\n\nThis placeholder response simulates a polished agent output for the Golden Path demo.\n\n- Clear structure\n- Strong positioning\n- Production-ready tone`,
  is_vulnerable: false,
  explanation: 'No injection or jailbreak patterns detected in this prompt.',
};

export default function Dashboard() {
  const [workspaceName, setWorkspaceName] = useState(demoWorkspaceName);
  const [prompt, setPrompt] = useState(initialPrompt);

  const [sessionId, setSessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('session_id') || '';
    }
    return '';
  });
  const [recentSessions, setRecentSessions] = useState([]);

  const [useCases, setUseCases] = useState([]);
  const [agents, setAgents] = useState([]);

  const [selectedUseCase, setSelectedUseCase] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');

  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRecentSessions = async () => {
    try {
      const data = await listSessions();
      setRecentSessions(data);
    } catch (err) {
      console.error('Failed to fetch recent sessions', err);
    }
  };

  const handleSessionSelect = async (id) => {
    try {
      setLoading(true);
      const detail = await getSessionDetail(id);
      setSessionId(id);
      localStorage.setItem('session_id', id);

      if (detail.messages && detail.messages.length >= 2) {
        const userMsgs = detail.messages.filter((m) => m.role === 'user');
        const assistantMsgs = detail.messages.filter((m) => m.role === 'assistant');

        if (userMsgs.length > 0) {
          setPrompt(userMsgs[userMsgs.length - 1].content);
        }
        if (assistantMsgs.length > 0) {
          const lastAssistant = assistantMsgs[assistantMsgs.length - 1];
          setEvaluation({
            optimized_prompt: lastAssistant.content,
            agent_response: lastAssistant.agent_response || '',
            session_id: id,
            chat_history: detail.messages,
          });
        }
      } else {
        setPrompt('');
        setEvaluation(null);
      }
      setError('');
    } catch (err) {
      console.error('Failed to load session', err);
      setError('Failed to load session details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadRegistries = async () => {
      try {
        const [useCaseData, agentData] = await Promise.all([getUseCases(), getAgents()]);

        setUseCases(useCaseData);
        setAgents(agentData);
        fetchRecentSessions();
      } catch (err) {
        console.error('Failed to load registries', err);
      }
    };

    loadRegistries();
  }, []);

  useEffect(() => {
    if (workspaceName) {
      localStorage.setItem('workspace', workspaceName);
    }
  }, [workspaceName]);

  const handleAgentChange = (nextAgent) => {
    setSelectedAgent((previous) => (previous === nextAgent ? '' : nextAgent));
  };

  const handleUseCaseChange = (nextUseCase) => {
    setSelectedUseCase((previous) => (previous === nextUseCase ? '' : nextUseCase));
  };

  const handleEvaluationComplete = (nextEvaluation) => {
    const nextSessionId = nextEvaluation?.session_id || sessionId;

    setSessionId(nextSessionId || 'local-session-001');
    setSessionId(nextSessionId || '');
    setEvaluation({
      ...(nextEvaluation || {}),
      session_id: nextSessionId || '',
      selected_agent: selectedAgent || '',
    });
  };

  const handleNewSession = () => {
    setSessionId('');
    fetchRecentSessions();
  };

  const handleEvaluate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Evaluate and Scan run together so one click surfaces both the
      // scorecard/optimized prompt and any security findings.
      const [evaluateResult, scanResult] = await Promise.allSettled([
        evaluatePrompt(prompt, selectedUseCase, selectedAgent),
        scanPrompt(prompt),
      ]);

      if (evaluateResult.status !== 'fulfilled') {
        throw evaluateResult.reason;
      }

      const data = {
        ...evaluateResult.value,
        ...(scanResult.status === 'fulfilled' ? scanResult.value : {}),
      };

      handleEvaluationComplete(data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || 'Unable to connect to Evalio backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateRef = useRef(handleEvaluate);
  handleEvaluateRef.current = handleEvaluate;

  useEffect(() => {
    const handleKeydown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        handleEvaluateRef.current();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const handleNewSession = () => {
    setSessionId('');
    localStorage.removeItem('session_id');
    setPrompt('');
    setEvaluation(null);
    setError('');
    setLoading(false);
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
    setPrompt('Build me a REST API for a task management app');
    setEvaluation(demoEvaluation);
    setError('');
    setLoading(false);
    setSelectedAgent('claude');
    setSelectedUseCase('backend_dev');
  };

  const selectedUseCaseLabel = useCases.find((item) => item.id === selectedUseCase)?.label;
  const selectedAgentLabel = agents.find((item) => item.id === selectedAgent)?.label;
  const contextLabel =
    selectedUseCaseLabel && selectedAgentLabel
      ? `${selectedUseCaseLabel} · ${selectedAgentLabel}`
      : selectedUseCaseLabel || selectedAgentLabel || '';

  return (
    <div className="flex h-screen flex-col bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.07),_transparent_35%)] text-stone-100">
      <Navbar
        contextLabel={contextLabel}
        onEvaluate={handleEvaluate}
        loading={loading}
        evaluateDisabled={!prompt.trim()}
      />

      <ContextBar
        useCases={useCases}
        agents={agents}
        selectedUseCase={selectedUseCase}
        selectedAgent={selectedAgent}
        onUseCaseChange={handleUseCaseChange}
        onAgentChange={handleAgentChange}
      />

      {workspaceName === demoWorkspaceName ? (
        <div className="mx-4 mt-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-2.5 sm:mx-6 lg:mx-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-amber-200">Golden Path Demo</p>
              <p className="text-xs text-amber-100/70">This workspace is preconfigured for the hackathon demonstration.</p>
            </div>
            <button
              type="button"
              onClick={handleLoadDemoSession}
              className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-200 transition hover:bg-amber-500/20"
            >
              Load Demo Session
            </button>
          </div>
        </div>
      ) : null}

      <div className="min-h-0 flex-1 px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[240px_minmax(0,1.3fr)_minmax(0,1fr)]">
          <Sidebar
            recentSessions={recentSessions}
            onSessionSelect={handleSessionSelect}
            onNewSession={handleNewSession}
            workspaceName={workspaceName}
          />

          <PromptEditor prompt={prompt} onPromptChange={setPrompt} evaluation={evaluation} loading={loading} />

          <OutputPanel evaluation={evaluation} error={error} loading={loading} />
        </div>
      </div>
    </div>
  );
}
