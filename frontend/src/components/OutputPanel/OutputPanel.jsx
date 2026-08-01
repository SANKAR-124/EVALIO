import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Copy, Download, Sparkles } from 'lucide-react';

function normalizeAgentLabel(agent) {
  if (!agent) {
    return 'Agent';
  }

  return agent;
}

function renderInlineMarkdown(text) {
  if (!text) {
    return null;
  }

  const parts = [];
  const regex = /(\*\*([^*]+)\*\*|`([^`]+)`|__([^_]+)__|_([^_]+)_|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    if (match[2]) {
      parts.push(<strong key={`${match.index}-strong`}>{match[2]}</strong>);
    } else if (match[3]) {
      parts.push(
        <code key={`${match.index}-code`} className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[0.8rem] text-cyan-200">
          {match[3]}
        </code>,
      );
    } else if (match[4]) {
      parts.push(<strong key={`${match.index}-strong2`}>{match[4]}</strong>);
    } else if (match[5]) {
      parts.push(<em key={`${match.index}-em`}>{match[5]}</em>);
    } else if (match[6]) {
      parts.push(<em key={`${match.index}-em2`}>{match[6]}</em>);
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function renderResponseContent(content) {
  if (!content) {
    return (
      <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center">
        <p className="text-sm text-slate-400">
          Waiting for an agent response to render here.
        </p>
      </div>
    );
  }

  const isMarkdown = /(^#{1,6}\s)|(^[-*]\s)|(```)|(`[^`]+`)|(^>\s)/m.test(content);

  if (!isMarkdown) {
    return (
      <div className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
        {content}
      </div>
    );
  }

  const blocks = [];
  const lines = content.split('\n');
  let paragraphLines = [];
  let listItems = [];
  let codeBlock = [];
  let inCodeBlock = false;

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      blocks.push(
        <p key={`paragraph-${blocks.length}`} className="text-sm leading-7 text-slate-300">
          {renderInlineMarkdown(paragraphLines.join(' ').trim())}
        </p>,
      );
      paragraphLines = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push(
        <ul key={`list-${blocks.length}`} className="ml-5 list-disc space-y-2 text-sm leading-7 text-slate-300">
          {listItems.map((item, index) => (
            <li key={`${item}-${index}`}>{renderInlineMarkdown(item)}</li>
          ))}
        </ul>,
      );
      listItems = [];
    }
  };

  const flushCodeBlock = () => {
    if (codeBlock.length > 0) {
      blocks.push(
        <pre key={`code-${blocks.length}`} className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-sm leading-6 text-cyan-200">
          <code>{codeBlock.join('\n')}</code>
        </pre>,
      );
      codeBlock = [];
    }
  };

  lines.forEach((line) => {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
        inCodeBlock = false;
      } else {
        flushParagraph();
        flushList();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBlock.push(line);
      return;
    }

    if (/^#{1,6}\s+/.test(line)) {
      flushParagraph();
      flushList();
      const level = line.match(/^(#{1,6})/)[1].length;
      const HeadingTag = `h${Math.min(level, 3)}`;
      blocks.push(
        <HeadingTag key={`heading-${blocks.length}`} className="text-sm font-semibold text-slate-100">
          {line.replace(/^(#{1,6})\s+/, '')}
        </HeadingTag>,
      );
      return;
    }

    if (/^>\s*/.test(line)) {
      flushParagraph();
      flushList();
      blocks.push(
        <blockquote key={`quote-${blocks.length}`} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm italic text-slate-400">
          {renderInlineMarkdown(line.replace(/^>\s*/, '').trim())}
        </blockquote>,
      );
      return;
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      listItems.push(line.replace(/^[-*]\s+/, '').trim());
      return;
    }

    if (line.trim() === '') {
      flushParagraph();
      flushList();
      return;
    }

    paragraphLines.push(line.trim());
  });

  flushParagraph();
  flushList();
  flushCodeBlock();

  return <div className="space-y-3">{blocks}</div>;
}

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
  vulnerabilityDetected = false,
  selectedAgent,
  agentResponse,
}) {
  const [copied, setCopied] = useState(false);
  const fallback = panelContent[activeAction];

  const optimizedPrompt = evaluation?.optimized_prompt || '';
  const activeAgent = useMemo(() => normalizeAgentLabel(selectedAgent), [selectedAgent]);
  const responseContent = useMemo(() => agentResponse || evaluation?.agent_response || evaluation?.response || evaluation?.output || '', [agentResponse, evaluation]);

  const issues =
    evaluation?.scorecard?.weaknesses?.length
      ? evaluation.scorecard.weaknesses
      : fallback.issues;

  const suggestions = fallback.suggestions;

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  const handleCopyOutput = async () => {
    if (!optimizedPrompt) {
      return;
    }

    try {
      await navigator.clipboard.writeText(optimizedPrompt);
      setCopied(true);
    } catch (error) {
      console.error('Failed to copy output', error);
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyOutput}
            disabled={!optimizedPrompt}
            className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Copy className="h-3.5 w-3.5" />
            {copied ? 'Copied!' : 'Copy Output'}
          </button>

          <button
            type="button"
            onClick={handleDownloadOutput}
            disabled={!optimizedPrompt}
            className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </button>

          <div className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-medium text-violet-300">
            {activeAction}
          </div>
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

      {vulnerabilityDetected ? (
        <div className="mb-4 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 shadow-lg shadow-red-950/20">
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <div className="mt-0.5 rounded-full bg-red-500/20 p-2 text-red-300">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-200">
                  Potential Prompt Injection Detected
                </p>
                <p className="mt-1 text-sm text-red-200/80">
                  This prompt may contain malicious or unsafe instructions.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-200 transition hover:bg-red-500/20"
            >
              View Details
            </button>
          </div>
        </div>
      ) : null}

      <div className="max-h-[470px] space-y-4 overflow-y-auto pr-2">

        {/* Agent Output */}

        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <p className="text-sm font-semibold text-slate-200">
                Agent Output
              </p>
            </div>
            <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-200">
              {activeAgent}
            </span>
          </div>

          <div className="mt-4 max-h-[220px] overflow-y-auto rounded-xl border border-slate-800/80 bg-slate-950/80 p-4">
            {renderResponseContent(responseContent)}
          </div>
        </div>

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