import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Copy, Download, ShieldAlert } from 'lucide-react';

const TABS = ['Scorecard', 'Scanner', 'History'];

const metricBars = [
  { key: 'clarity', label: 'Clarity', color: 'bg-emerald-400' },
  { key: 'constraints', label: 'Constraints', color: 'bg-amber-400' },
  { key: 'formatting', label: 'Formatting', color: 'bg-cyan-400' },
];

function ScoreRing({ score = 0 }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(score, 0), 100) / 100) * circumference;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="mx-auto">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="#292524" strokeWidth="10" />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="url(#scoreGradient)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
      />
      <defs>
        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>
      <text x="60" y="66" textAnchor="middle" className="fill-stone-100 text-2xl font-semibold">
        {score}
      </text>
    </svg>
  );
}

export default function OutputPanel({ evaluation, error, loading }) {
  const [activeTab, setActiveTab] = useState('Scorecard');
  const [copied, setCopied] = useState(false);

  const optimizedPrompt = evaluation?.optimized_prompt || '';
  const scorecard = evaluation?.scorecard;

  const chatHistory = useMemo(() => evaluation?.chat_history || [], [evaluation]);

  const handleCopyOutput = async () => {
    if (!optimizedPrompt) {
      return;
    }

    try {
      await navigator.clipboard.writeText(optimizedPrompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy output', err);
    }
  };

  const handleDownloadOutput = () => {
    if (!optimizedPrompt) {
      return;
    }

    const blob = new Blob([optimizedPrompt], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'optimized_prompt.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-stone-800 bg-stone-950/60">
      {/* Tab bar */}
      <div className="flex items-center justify-between border-b border-stone-800/80 bg-stone-900/40 px-3 py-2">
        <div className="flex items-center gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                activeTab === tab
                  ? 'bg-amber-500/15 text-amber-300'
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCopyOutput}
            disabled={!optimizedPrompt}
            title="Copy optimized prompt"
            className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-800 hover:text-stone-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleDownloadOutput}
            disabled={!optimizedPrompt}
            title="Download optimized prompt"
            className="rounded-lg p-1.5 text-stone-400 transition hover:bg-stone-800 hover:text-stone-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {copied ? (
        <div className="border-b border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-center text-[11px] text-emerald-300">
          Copied optimized prompt to clipboard
        </div>
      ) : null}

      {error ? (
        <div className="border-b border-red-500/30 bg-red-500/10 px-3 py-2">
          <p className="text-xs text-red-300">{error}</p>
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'Scorecard' ? (
          scorecard ? (
            <div>
              <ScoreRing score={scorecard.overall_score} />
              <p className="mt-1 text-center text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
                Overall Score
              </p>

              <div className="mt-6 space-y-4">
                {metricBars.map((metric) => (
                  <div key={metric.key}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="text-stone-300">{metric.label}</span>
                      <span className="font-semibold text-stone-100">{scorecard[metric.key]}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-stone-800">
                      <div
                        className={`h-1.5 rounded-full ${metric.color}`}
                        style={{ width: `${scorecard[metric.key]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-400">Weaknesses</p>
                </div>

                <div className="space-y-2">
                  {scorecard.weaknesses?.length ? (
                    scorecard.weaknesses.map((weakness, index) => (
                      <div
                        key={index}
                        className="rounded-lg border-l-2 border-red-500/60 bg-red-500/5 px-3 py-2 text-xs leading-5 text-red-200/90"
                      >
                        {weakness}
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-stone-500">No weaknesses flagged.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-stone-800 p-6 text-center">
              <p className="text-sm text-stone-500">{loading ? 'Evaluating…' : 'Run Evaluate to see the scorecard.'}</p>
            </div>
          )
        ) : null}

        {activeTab === 'Scanner' ? (
          evaluation ? (
            <div className="space-y-3">
              <div
                className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium ${
                  evaluation.is_vulnerable
                    ? 'border-red-500/40 bg-red-500/10 text-red-200'
                    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                }`}
              >
                {evaluation.is_vulnerable ? (
                  <ShieldAlert className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                {evaluation.is_vulnerable
                  ? `Vulnerability detected: ${evaluation.vulnerability_type || 'Potential Threat'}`
                  : 'No vulnerabilities detected'}
              </div>

              {evaluation.explanation ? (
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">Explanation</p>
                  <p className="text-sm leading-6 text-stone-300">{evaluation.explanation}</p>
                </div>
              ) : null}

              {evaluation.suggested_mitigation ? (
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                    Suggested Mitigation
                  </p>
                  <div className="rounded-lg border-l-2 border-amber-500/60 bg-amber-500/5 px-3 py-2 text-sm leading-6 text-amber-100/90">
                    {evaluation.suggested_mitigation}
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-stone-800 p-6 text-center">
              <p className="text-sm text-stone-500">{loading ? 'Scanning…' : 'Run Evaluate to see scan results.'}</p>
            </div>
          )
        ) : null}

        {activeTab === 'History' ? (
          chatHistory.length ? (
            <div className="space-y-2.5">
              {chatHistory.map((message, index) => (
                <div key={index} className="rounded-lg border border-stone-800/80 bg-stone-900/50 p-2.5">
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-[0.2em] ${
                        message.role === 'user' ? 'text-cyan-300' : 'text-amber-300'
                      }`}
                    >
                      {message.role}
                    </span>
                    {message.timestamp ? (
                      <span className="text-[10px] text-stone-600">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                    ) : null}
                  </div>
                  <p className="line-clamp-3 text-xs leading-5 text-stone-400">{message.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-stone-800 p-6 text-center">
              <p className="text-sm text-stone-500">No history yet for this session.</p>
            </div>
          )
        ) : null}
      </div>
    </section>
  );
}
