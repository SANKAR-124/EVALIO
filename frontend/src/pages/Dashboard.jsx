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

export default function Dashboard({ onLogout }) {
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

  const handleNewSession = () => {
    setSessionId('');
    localStorage.removeItem('session_id');
    setPrompt('');
    setEvaluation(null);
    setError('');
    setLoading(false);
  };

  const handleEvaluate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }

    setLoading(true);
    setError('');

    try {
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

      const nextSessionId = data?.session_id || sessionId;
      setSessionId(nextSessionId || '');
      setEvaluation({
        ...(data || {}),
        session_id: nextSessionId || '',
        selected_agent: selectedAgent || '',
      });
      fetchRecentSessions();
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

  const handleLoadDemoSession = () => {
    setWorkspaceName(demoWorkspaceName);
    setSessionId(demoEvaluation.session_id);
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



      <div className="min-h-0 flex-1 px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[240px_minmax(0,1.3fr)_minmax(0,1fr)]">
          <Sidebar
            recentSessions={recentSessions}
            onSessionSelect={handleSessionSelect}
            onNewSession={handleNewSession}
            workspaceName={workspaceName}
            onLogout={onLogout}
          />

          <PromptEditor prompt={prompt} onPromptChange={setPrompt} evaluation={evaluation} loading={loading} />

          <OutputPanel evaluation={evaluation} error={error} loading={loading} />
        </div>
      </div>
    </div>
  );
}
