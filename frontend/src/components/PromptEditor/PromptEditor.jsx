import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { ScanSearch, Sparkles, Wand2 } from 'lucide-react';

import { evaluatePrompt } from "../../services/evaluate";
import { optimizePrompt } from "../../services/optimize";
import { scanPrompt } from "../../services/scan";

const actions = [
  { key: 'Evaluate', label: 'Evaluate', icon: Sparkles },
  { key: 'Optimize', label: 'Optimize', icon: Wand2 },
  { key: 'Scan', label: 'Scan', icon: ScanSearch },
];

export default function PromptEditor({
    prompt,
    onPromptChange,
    activeAction,
    onActionChange,
    onEvaluationComplete,
    loading,
    setLoading,
    setError
}) {
  const handleAction = async (actionKey) => {
  onActionChange(actionKey);

  if (!prompt.trim()) {
    alert("Please enter a prompt.");
    return;
  }

  try {
    let data;

    switch (actionKey) {
      case "Evaluate":
        data = await evaluatePrompt(prompt);
        break;

      case "Optimize":
        data = await optimizePrompt(prompt);
        break;

      case "Scan":
        data = await scanPrompt(prompt);
        break;

      default:
        return;
    }

    onEvaluationComplete(data);
    const history = JSON.parse(
  localStorage.getItem("promptHistory") || "[]"
);

history.unshift(prompt);

localStorage.setItem(
  "promptHistory",
  JSON.stringify(history.slice(0, 10))
);
  } catch(err){

    console.error(err);

    setError(
        err?.response?.data?.detail ||
        "Unable to connect to Evalio backend."
    );

}
finally{

    setLoading(false);

}
 };

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl shadow-slate-950/20 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-200">
            Prompt Editor
          </p>
          <p className="text-sm text-slate-400">
            Craft and refine your instruction set
          </p>
        </div>

        <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
          One Dark
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
        <CodeMirror
          value={prompt}
          height="340px"
          theme={oneDark}
          extensions={[markdown()]}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: true,
            autocompletion: true,
          }}
          placeholder="Describe what you want the AI to do..."
          onChange={onPromptChange}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          const isActive = activeAction === action.key;

          return (
            <button
    disabled={loading}
              key={action.key}
              type="button"
              onClick={() => handleAction(action.key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {loading && activeAction === action.key
    ? "Processing..."
    : action.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}