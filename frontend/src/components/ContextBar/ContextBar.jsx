const DEFAULT_USE_CASES = [
  { id: 'image_gen', name: 'Image Gen', icon: '🎨' },
  { id: 'video_gen', name: 'Video Gen', icon: '🎬' },
  { id: 'backend_dev', name: 'Backend Dev', icon: '⚙️' },
  { id: 'ui_dev', name: 'UI Dev', icon: '💻' },
  { id: 'data_analysis', name: 'Data Analysis', icon: '📊' },
  { id: 'content_writing', name: 'Content Writing', icon: '✍️' },
  { id: 'code_review', name: 'Code Review', icon: '🔍' },
  { id: 'machine_learning', name: 'ML', icon: '🤖' },
];

const DEFAULT_AGENTS = [
  { id: 'claude', name: 'Claude', provider: 'Anthropic' },
  { id: 'chatgpt', name: 'ChatGPT', provider: 'OpenAI' },
  { id: 'gemini', name: 'Gemini', provider: 'Google' },
  { id: 'llama', name: 'LLaMA', provider: 'Meta' },
  { id: 'deepseek', name: 'DeepSeek', provider: 'DeepSeek' },
  { id: 'mistral', name: 'Mistral', provider: 'Mistral' },
];

function normalizeOptions(options, fallbackOptions) {
  if (Array.isArray(options) && options.length > 0) {
    return options
      .map((option) => {
        if (typeof option === 'string') {
          return { id: option, name: option };
        }

        if (option && typeof option === 'object') {
          const name = option.label || option.name || option.title || option.value;

          if (!name) {
            return null;
          }

          return {
            id: option.id || option.value || name,
            name,
            icon: option.icon,
            provider: option.provider,
          };
        }

        return null;
      })
      .filter(Boolean);
  }

  return fallbackOptions;
}

function PillRow({ label, items, selectedId, onSelect }) {
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center py-0.5">
      <span className="w-14 shrink-0 text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-500">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => {
          const itemId = item.id || item.name;
          const isActive = itemId === selectedId || item.name === selectedId;

          return (
            <button
              key={itemId}
              type="button"
              onClick={() => onSelect(isActive ? '' : itemId)}
              className={`flex items-center gap-1 rounded-md border px-2 py-0.5 text-[9px] font-semibold tracking-wider transition duration-150 ${
                isActive
                  ? 'border-amber-500 bg-amber-500 text-stone-950 shadow-md shadow-amber-500/10'
                  : 'border-stone-850 bg-stone-950/60 text-stone-400 hover:border-stone-700 hover:text-stone-200'
              }`}
            >
              {item.icon ? <span>{item.icon}</span> : null}
              <span>{item.name}</span>
              {item.provider ? (
                <span className={`text-[8px] font-bold tracking-wide uppercase ml-1.5 ${
                  isActive ? 'text-stone-800/80' : 'text-stone-600'
                }`}>{item.provider}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
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

  return (
    <section className="space-y-1 border-b border-stone-900 bg-stone-950/80 px-4 py-2 sm:px-6 lg:px-8">
      <PillRow label="use case" items={normalizedUseCases} selectedId={selectedUseCase} onSelect={onUseCaseChange} />
      <PillRow label="agent" items={normalizedAgents} selectedId={selectedAgent} onSelect={onAgentChange} />
    </section>
  );
}
