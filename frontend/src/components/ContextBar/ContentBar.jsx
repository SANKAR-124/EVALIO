export default function ContextBar({
  useCases,
  agents,
  selectedUseCase,
  selectedAgent,
  onUseCaseChange,
  onAgentChange,
}) {
  return (
    <div className="mb-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Use Case */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Use Case
          </label>

          <select
            value={selectedUseCase}
            onChange={(e) => onUseCaseChange(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-200 outline-none focus:border-cyan-500"
          >
            <option value="">Select Use Case</option>

            {useCases.map((item) => (
              <option key={item.id} value={item.id}>
                {item.icon} {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Target Agent */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Target Agent
          </label>

          <select
            value={selectedAgent}
            onChange={(e) => onAgentChange(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-200 outline-none focus:border-violet-500"
          >
            <option value="">Select Agent</option>

            {agents.map((item) => (
              <option key={item.id} value={item.id}>
                {item.icon} {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}