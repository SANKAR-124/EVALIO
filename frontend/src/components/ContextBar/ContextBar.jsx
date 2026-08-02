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
          const name = option.name || option.label || option.title || option.value;

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
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="w-24 shrink-0 text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isActive = item.id === selectedId || item.name === selectedId;

          return (
            <button
              key={item.id || item.name}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                isActive
                  ? 'border-amber-400/40 bg-amber-500/15 text-amber-200'
                  : 'border-stone-800 bg-stone-950/60 text-stone-400 hover:border-stone-700 hover:text-stone-200'
              }`}
            >
              {item.icon ? <span>{item.icon}</span> : null}
              <span>{item.name}</span>
              {item.provider ? (
                <span className="text-[10px] uppercase tracking-wide text-stone-500">{item.provider}</span>
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
    <section className="space-y-2.5 border-b border-stone-800/80 bg-stone-950/70 px-4 py-3 sm:px-6 lg:px-8">
      <PillRow label="Use Case" items={normalizedUseCases} selectedId={selectedUseCase} onSelect={onUseCaseChange} />
      <PillRow label="Agent" items={normalizedAgents} selectedId={selectedAgent} onSelect={onAgentChange} />
    </section>
  );
}
