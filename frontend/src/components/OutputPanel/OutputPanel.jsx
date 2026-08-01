import { AlertTriangle, Sparkles } from 'lucide-react';

const panelContent = {
  Evaluate: {
    title: 'Evaluation Summary',
    suggestions: [
      'Add a success metric to ground the response.',
      'Include a persona to sharpen tone and detail.',
    ],
    issues: [
      'The prompt uses a broad objective without a defined output format.',
      'Context for the target audience is only implied.',
    ],
  },

  Optimize: {
    title: 'Optimization Preview',
    suggestions: [
      'Rephrase the opening to remove ambiguity.',
      'Introduce explicit examples for better consistency.',
    ],
    issues: [
      'The original prompt is slightly verbose.',
      'A few constraints are not clearly prioritized.',
    ],
  },

  Scan: {
    title: 'Scan Report',
    suggestions: [
      'Add boundary conditions.',
      'Define response format.',
    ],
    issues: [
      'Missing guardrails.',
      'Output style not specified.',
    ],
  },
};

export default function OutputPanel({
  activeAction,
  prompt,
  evaluation,
  error,
  loading,
}) {
  const fallback = panelContent[activeAction];

  const optimizedPrompt = evaluation?.optimized_prompt || '';

  const issues =
    evaluation?.scorecard?.weaknesses?.length
      ? evaluation.scorecard.weaknesses
      : fallback.issues;

  const suggestions = fallback.suggestions;

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl shadow-slate-950/20 backdrop-blur">

      {/* Header */}

      <div className="mb-4 flex items-center justify-between">

        <div>
          <p className="text-sm font-semibold text-slate-200">
            {fallback.title}
          </p>

          <p className="text-sm text-slate-400">
            Live preview with actionable feedback
          </p>
        </div>

        <div className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-300">
          {activeAction}
        </div>

      </div>

      {/* Error Banner */}

      {error && (
        <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
          <p className="text-sm text-red-300">
            {error}
          </p>
        </div>
      )}

      {/* Loading Banner */}

      {loading && (
        <div className="mb-4 rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3">
          <p className="animate-pulse text-sm text-cyan-300">
            Evaluating prompt...
          </p>
        </div>
      )}

      <div className="max-h-[470px] space-y-4 overflow-y-auto pr-2">

        {/* Optimized Prompt */}

        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">

          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />

            <p className="text-sm font-semibold text-slate-200">
              Optimized Prompt
            </p>
          </div>

          {evaluation ? (
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {optimizedPrompt}
            </p>
          ) : (
            <div className="mt-3 rounded-xl border border-dashed border-slate-700 p-6 text-center">
              <p className="text-slate-400">
                Run an evaluation to view optimized prompts.
              </p>
            </div>
          )}

          <p className="mt-3 text-xs text-slate-500">
            Source prompt: {prompt.slice(0, 92)}...
          </p>

        </div>

        {/* Suggestions + Issues */}

        <div className="grid gap-4 lg:grid-cols-2">

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">

            <p className="text-sm font-semibold text-slate-200">
              Suggestions
            </p>

            <ul className="mt-3 space-y-2 text-sm text-slate-400">

              {suggestions.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400"></span>
                  <span>{item}</span>
                </li>
              ))}

            </ul>

          </div>

          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">

            <div className="flex items-center gap-2">

              <AlertTriangle className="h-4 w-4 text-amber-300" />

              <p className="text-sm font-semibold text-amber-200">
                Issues Found
              </p>

            </div>

            <ul className="mt-3 space-y-2 text-sm text-amber-100/80">

              {issues.length > 0 ? (
                issues.map((item, index) => (
                  <li key={index} className="flex gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-amber-400"></span>
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-500">
                  No evaluation yet.
                </li>
              )}

            </ul>

          </div>

        </div>

      </div>

    </section>
  );
}