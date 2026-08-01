import { Bot, BriefcaseBusiness, ChevronDown } from 'lucide-react';

const DEFAULT_USE_CASES = [
  { id: 'image-generation', name: 'Image Generation' },
  { id: 'video-generation', name: 'Video Generation' },
  { id: 'backend-development', name: 'Backend Development' },
  { id: 'ui-frontend-development', name: 'UI / Frontend Development' },
  { id: 'data-analysis', name: 'Data Analysis' },
  { id: 'content-writing', name: 'Content Writing' },
  { id: 'code-review', name: 'Code Review' },
  { id: 'machine-learning', name: 'Machine Learning' },
];

const DEFAULT_AGENTS = [
  { id: 'claude', name: 'Claude' },
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'gemini', name: 'Gemini' },
  { id: 'llama', name: 'LLaMA' },
  { id: 'deepseek', name: 'DeepSeek' },
  { id: 'mistral', name: 'Mistral' },
];

function normalizeOptions(options, fallbackOptions) {
  if (Array.isArray(options) && options.length > 0) {
    return options
      .map((option) => {
        if (typeof option === 'string') {
          return { id: option, name: option };
        }

        if (option && typeof option === 'object') {
          const name = option.name || option.label || option.title || option.value;

          if (!name) {
            return null;
          }

          return {
            id: option.id || option.value || name,
            name,
          };
        }

        return null;
      })
      .filter(Boolean);
  }

  return fallbackOptions;
}

export default function ContextBar({
  useCases = [],
  agents = [],
  selectedUseCase,
  selectedAgent,
  onUseCaseChange,
  onAgentChange,
}) {
  const normalizedUseCases = normalizeOptions(useCases, DEFAULT_USE_CASES);
  const normalizedAgents = normalizeOptions(agents, DEFAULT_AGENTS);
  const showContextSummary = Boolean(selectedUseCase || selectedAgent);
  const selectedUseCaseLabel = normalizedUseCases.find(
    (item) => item.name === selectedUseCase || item.id === selectedUseCase,
  )?.name || selectedUseCase;
  const selectedAgentLabel = normalizedAgents.find(
    (item) => item.name === selectedAgent || item.id === selectedAgent,
  )?.name || selectedAgent;

  return (
    <section className="mb-6 flex flex-col gap-3 rounded-3xl border border-slate-800/80 bg-slate-900/60 p-4 shadow-xl shadow-slate-950/20 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-200">Evaluation Context</p>
        <p className="text-sm text-slate-400">Choose the scenario and agent profile to frame the prompt.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="group relative flex min-w-[220px] items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-300 transition duration-200 hover:border-slate-700 hover:bg-slate-900 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20">
          <BriefcaseBusiness className="h-4 w-4 text-cyan-400" />
          <div className="flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Use Case
            </div>
            <div className="relative">
              <select
                value={selectedUseCase}
                onChange={(event) => onUseCaseChange(event.target.value)}
                className="w-full appearance-none bg-transparent pr-6 text-sm font-medium text-slate-100 outline-none"
              >
                <option value="" className="bg-slate-900 text-slate-200">
                  Select a use case
                </option>
                {normalizedUseCases.map((item) => (
                  <option key={item.id || item.name} value={item.name} className="bg-slate-900 text-slate-200">
                    {item.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-hover:text-slate-300" />
            </div>
          </div>
        </label>

        <label className="group relative flex min-w-[220px] items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-300 transition duration-200 hover:border-slate-700 hover:bg-slate-900 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/20">
          <Bot className="h-4 w-4 text-violet-400" />
          <div className="flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Target Agent
            </div>
            <div className="relative">
              <select
                value={selectedAgent}
                onChange={(event) => onAgentChange(event.target.value)}
                className="w-full appearance-none bg-transparent pr-6 text-sm font-medium text-slate-100 outline-none"
              >
                <option value="" className="bg-slate-900 text-slate-200">
                  Select an agent
                </option>
                {normalizedAgents.map((item) => (
                  <option key={item.id || item.name} value={item.name} className="bg-slate-900 text-slate-200">
                    {item.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-hover:text-slate-300" />
            </div>
          </div>
        </label>
      </div>

      {showContextSummary ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-3 sm:col-span-2 sm:w-full">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-200">
            <BriefcaseBusiness className="h-4 w-4" />
            <span className="font-medium">{selectedUseCaseLabel || 'Use case'}</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-sm text-violet-200">
            <Bot className="h-4 w-4" />
            <span className="font-medium">{selectedAgentLabel || 'Agent'}</span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
