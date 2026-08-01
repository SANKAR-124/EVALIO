import { AlertTriangle, Sparkles } from 'lucide-react';

const panelContent = {
  Evaluate: {
    title: 'Evaluation Summary',
    summary: 'Strong prompt structure with clear goals and measurable outcomes.',
    optimizedPrompt:
      'You are a product strategist helping teams refine launch messaging. Prioritize clarity, customer value, and concise action points. Keep the output structured for fast review.',
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
    summary:
      'The instruction now emphasizes role, task, and expected output format.',
    optimizedPrompt:
      'Act as an expert prompt engineer. Rewrite this request to be precise, outcome-driven, and easy for an AI assistant to follow.',
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
    summary:
      'The request is mostly actionable, but it can be more robust for production use.',
    optimizedPrompt:
      'Review the draft prompt for clarity, risk, and completeness.',
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
}) {
  const fallback = panelContent[activeAction];

  const optimizedPrompt =
    evaluation?.optimized_prompt || fallback.optimizedPrompt;

  const issues =
    evaluation?.scorecard?.weaknesses?.length
      ? evaluation.scorecard.weaknesses
      : fallback.issues;

  const suggestions = fallback.suggestions;

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl shadow-slate-950/20 backdrop-blur">

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

      <div className="max-h-[470px] space-y-4 overflow-y-auto pr-2">

        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">

          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <p className="text-sm font-semibold text-slate-200">
              Optimized Prompt
            </p>
          </div>

          <p className="mt-3 text-sm leading-7 text-slate-300">
            {optimizedPrompt}
          </p>

          <p className="mt-3 text-xs text-slate-500">
            Source prompt: {prompt.slice(0, 92)}...
          </p>

        </div>

        <div className="grid gap-4 lg:grid-cols-2">

          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">

            <p className="text-sm font-semibold text-slate-200">
              Suggestions
            </p>

            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              {suggestions.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
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
              {issues.map((item, index) => (
                <li key={index} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

          </div>

        </div>

      </div>

    </section>
  );
}