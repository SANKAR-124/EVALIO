import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { ChevronDown, ScanSearch, Sparkles, Wand2 } from 'lucide-react';

import { evaluatePrompt } from "../../services/evaluate";
import { optimizePrompt } from "../../services/optimize";
import { scanPrompt } from "../../services/scan";

const actions = [
  { key: 'Evaluate', label: 'Evaluate', icon: Sparkles },
  { key: 'Optimize', label: 'Optimize', icon: Wand2 },
  { key: 'Scan', label: 'Scan', icon: ScanSearch },
];

const templates = {
  'Backend API': `You are a senior backend engineer. Design a production-ready REST API for a task management platform. Include authentication, pagination, validation, error handling, and clear response schemas for create, read, update, and delete operations.`,
  'React Dashboard': `You are a senior React engineer. Create a polished dashboard experience for a SaaS product. Prioritize responsive layout, accessible interactions, clear information hierarchy, and a modern dark UI with intuitive visual feedback.`,
  'Code Review': `You are an expert code reviewer. Review the following implementation for correctness, maintainability, readability, and potential bugs. Focus on architecture, edge cases, testing gaps, and opportunities for simplification.`,
  'SQL Optimization': `You are a database performance specialist. Analyze the provided SQL query and suggest improvements for indexing, joins, filtering, aggregation, and query structure to improve execution speed and scalability.`,
  'Machine Learning': `You are a machine learning engineer. Design a robust approach for training and evaluating a predictive model. Include data preparation, feature engineering, model selection, evaluation metrics, and deployment considerations.`,
};

export default function PromptEditor({
    prompt,
    onPromptChange,
    activeAction,
    onActionChange,
    onEvaluationComplete,
    onPromptEvaluated,
    loading,
    setLoading,
    setError,
    selectedAgent,
    selectedUseCase,
}) {
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const characterCount = prompt.length;
  const words = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;
  const estimatedTokens = Math.round(words * 1.3);

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
        data = await evaluatePrompt(prompt, selectedUseCase, selectedAgent);
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

    if (typeof onPromptEvaluated === 'function') {
      onPromptEvaluated(prompt);
    }
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

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-300">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              Templates
            </span>
            <select
              value={selectedTemplate}
              onChange={(event) => {
                const nextTemplate = event.target.value;
                setSelectedTemplate(nextTemplate);

                if (templates[nextTemplate]) {
                  onPromptChange(templates[nextTemplate]);
                }
              }}
              className="bg-transparent pr-6 text-sm font-medium text-slate-100 outline-none"
            >
              <option value="" className="bg-slate-900 text-slate-200">
                Choose...
              </option>
              {Object.keys(templates).map((templateName) => (
                <option key={templateName} value={templateName} className="bg-slate-900 text-slate-200">
                  {templateName}
                </option>
              ))}
            </select>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </label>

          <div className="flex items-center gap-2">
            <div className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-300">
              {selectedAgent || 'No agent selected'}
            </div>
            <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
              One Dark
            </div>
          </div>
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

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/70 px-4 py-3 text-sm text-slate-400">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <span className="font-medium text-slate-300">
            Characters: <span className="text-slate-100">{characterCount}</span>
          </span>
          <span className="font-medium text-slate-300">
            Words: <span className="text-slate-100">{words}</span>
          </span>
          <span className="font-medium text-slate-300">
            Estimated Tokens: <span className="text-slate-100">{estimatedTokens}</span>
          </span>
        </div>
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