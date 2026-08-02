import { useMemo, useState } from 'react';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { ChevronDown, Copy, Sparkles } from 'lucide-react';

const editorExtensions = [markdown(), EditorView.lineWrapping];

const templates = {
  'Backend API': `You are a senior backend engineer. Design a production-ready REST API for a task management platform. Include authentication, pagination, validation, error handling, and clear response schemas for create, read, update, and delete operations.`,
  'React Dashboard': `You are a senior React engineer. Create a polished dashboard experience for a SaaS product. Prioritize responsive layout, accessible interactions, clear information hierarchy, and a modern dark UI with intuitive visual feedback.`,
  'Code Review': `You are an expert code reviewer. Review the following implementation for correctness, maintainability, readability, and potential bugs. Focus on architecture, edge cases, testing gaps, and opportunities for simplification.`,
  'SQL Optimization': `You are a database performance specialist. Analyze the provided SQL query and suggest improvements for indexing, joins, filtering, aggregation, and query structure to improve execution speed and scalability.`,
  'Machine Learning': `You are a machine learning engineer. Design a robust approach for training and evaluating a predictive model. Include data preparation, feature engineering, model selection, evaluation metrics, and deployment considerations.`,
};

function highlightXml(text) {
  if (!text) {
    return null;
  }

  const parts = text.split(/(<\/?[a-zA-Z_][\w-]*>)/g);

  return parts.map((part, index) =>
    /^<\/?[a-zA-Z_][\w-]*>$/.test(part) ? (
      <span key={index} className="font-semibold text-amber-400">
        {part}
      </span>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

export default function PromptEditor({
  prompt,
  onPromptChange,
  evaluation,
  loading,
}) {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [cursor, setCursor] = useState({ line: 1, col: 1 });
  const [copied, setCopied] = useState(false);

  const characterCount = prompt.length;
  const words = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;
  const estimatedTokens = Math.round(words * 1.3);

  const optimizedPrompt = evaluation?.optimized_prompt || '';
  const overallScore = evaluation?.scorecard?.overall_score;
  const agentResponse = evaluation?.agent_response || '';

  const highlightedOptimized = useMemo(() => highlightXml(optimizedPrompt), [optimizedPrompt]);

  const handleEditorUpdate = (viewUpdate) => {
    if (!viewUpdate.state) {
      return;
    }

    const pos = viewUpdate.state.selection.main.head;
    const line = viewUpdate.state.doc.lineAt(pos);
    const nextCursor = { line: line.number, col: pos - line.from + 1 };

    setCursor((previous) =>
      previous.line === nextCursor.line && previous.col === nextCursor.col ? previous : nextCursor,
    );
  };

  const handleCopyRaw = async () => {
    if (!prompt) {
      return;
    }

    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy prompt', err);
    }
  };

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-800 bg-stone-950/60">
      {/* Tab bar */}
      <div className="flex items-center justify-end gap-3 border-b border-stone-800/80 bg-stone-900/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 rounded-lg border border-stone-800 bg-stone-950/80 px-2.5 py-1.5 text-xs text-stone-300">
            <span className="font-semibold uppercase tracking-[0.2em] text-stone-500">Templates</span>
            <select
              value={selectedTemplate}
              onChange={(event) => {
                const nextTemplate = event.target.value;
                setSelectedTemplate(nextTemplate);

                if (templates[nextTemplate]) {
                  onPromptChange(templates[nextTemplate]);
                }
              }}
              className="bg-transparent pr-4 text-xs font-medium text-stone-100 outline-none"
            >
              <option value="" className="bg-stone-900 text-stone-200">
                Choose…
              </option>
              {Object.keys(templates).map((templateName) => (
                <option key={templateName} value={templateName} className="bg-stone-900 text-stone-200">
                  {templateName}
                </option>
              ))}
            </select>
            <ChevronDown className="h-3.5 w-3.5 text-stone-500" />
          </label>

          <button
            type="button"
            onClick={handleCopyRaw}
            disabled={!prompt}
            className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-950/80 px-2.5 py-1.5 text-xs text-stone-300 transition hover:border-stone-700 hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {/* Raw Prompt */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">Raw Prompt</p>
            <p className="text-[11px] text-stone-600">
              LN {cursor.line}, COL {cursor.col}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-stone-800">
            <CodeMirror
              value={prompt}
              height="auto"
              minHeight="120px"
              theme={oneDark}
              extensions={editorExtensions}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLine: true,
                autocompletion: true,
              }}
              placeholder="Describe what you want the AI to do..."
              onChange={onPromptChange}
              onUpdate={handleEditorUpdate}
            />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-stone-500">
            <span>
              Characters: <span className="text-stone-300">{characterCount}</span>
            </span>
            <span>
              Words: <span className="text-stone-300">{words}</span>
            </span>
            <span>
              Est. Tokens: <span className="text-stone-300">{estimatedTokens}</span>
            </span>
          </div>
        </div>

        {/* Optimized Prompt */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">Optimized Prompt</p>
            {typeof overallScore === 'number' ? (
              <p className="text-[11px] font-semibold text-amber-300">SCORE: {overallScore}/100</p>
            ) : null}
          </div>

          {evaluation ? (
            <div
              className="resize overflow-auto rounded-xl border border-stone-800 bg-stone-950/80 p-3.5 font-mono text-[13px] leading-6 text-stone-300"
              style={{ minHeight: '160px', minWidth: '200px', maxWidth: '100%' }}
            >
              <pre className="whitespace-pre-wrap break-words font-mono">{highlightedOptimized}</pre>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-stone-800 p-6 text-center">
              <p className="text-sm text-stone-500">
                {loading ? 'Evaluating…' : 'Run Evaluate to view the optimized prompt.'}
              </p>
            </div>
          )}
        </div>

        {/* Agent Output */}
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">Agent Output</p>
          </div>

          {agentResponse ? (
            <div className="max-h-[220px] overflow-y-auto rounded-xl border border-stone-800 bg-stone-950/80 p-3.5 text-sm leading-7 text-stone-300 whitespace-pre-wrap">
              {agentResponse}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-stone-800 p-6 text-center">
              <p className="text-sm text-stone-500">Agent output will appear here after evaluation.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
