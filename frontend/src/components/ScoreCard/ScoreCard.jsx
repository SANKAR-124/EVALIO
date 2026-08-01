const scoreConfig = [
  {
    key: 'overall_score',
    label: 'Overall Score',
    detail: 'Overall prompt quality.',
    tone: 'from-cyan-400 to-sky-500',
  },
  {
    key: 'clarity',
    label: 'Clarity',
    detail: 'Instruction intent is easy to follow.',
    tone: 'from-violet-400 to-fuchsia-500',
  },
  {
    key: 'constraints',
    label: 'Constraints',
    detail: 'Defined rules and boundaries.',
    tone: 'from-amber-400 to-orange-500',
  },
  {
    key: 'formatting',
    label: 'Formatting',
    detail: 'Prompt structure and readability.',
    tone: 'from-rose-400 to-pink-500',
  },
];

export default function ScoreCard({ evaluation }) {
  const scorecard = evaluation?.scorecard;

  const scores = scoreConfig.map((item) => ({
    ...item,
    value:
      scorecard?.[item.key] ??
      (item.key === 'overall_score' ? 94 : 90),
  }));

  return (
    <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {scores.map((score) => (
        <article
          key={score.label}
          className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg shadow-slate-950/20"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-200">
              {score.label}
            </p>

            <span className="text-sm font-semibold text-slate-100">
              {score.value}/100
            </span>
          </div>

          <div className="mt-4 h-2 rounded-full bg-slate-800">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${score.tone}`}
              style={{ width: `${score.value}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-slate-400">
            {score.detail}
          </p>
        </article>
      ))}
    </section>
  );
}