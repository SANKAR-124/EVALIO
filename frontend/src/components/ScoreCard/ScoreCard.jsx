import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, BrainCircuit, Gauge, PenTool, ShieldCheck } from 'lucide-react';

const scoreConfig = [
  {
    key: 'overall_score',
    label: 'Overall Score',
    detail: 'Overall prompt quality.',
    tone: 'from-cyan-400 to-sky-500',
    icon: Award,
  },
  {
    key: 'clarity',
    label: 'Clarity',
    detail: 'Instruction intent is easy to follow.',
    tone: 'from-violet-400 to-fuchsia-500',
    icon: PenTool,
  },
  {
    key: 'context',
    label: 'Context',
    detail: 'Background and situational detail.',
    tone: 'from-emerald-400 to-lime-500',
    icon: BrainCircuit,
  },
  {
    key: 'constraints',
    label: 'Constraints',
    detail: 'Defined rules and boundaries.',
    tone: 'from-amber-400 to-orange-500',
    icon: ShieldCheck,
  },
  {
    key: 'formatting',
    label: 'Formatting',
    detail: 'Prompt structure and readability.',
    tone: 'from-rose-400 to-pink-500',
    icon: Gauge,
  },
];

export default function ScoreCard({ evaluation }) {
  const scorecard = evaluation?.scorecard;
  const previousSignatureRef = useRef('');
  const [animateCards, setAnimateCards] = useState(false);

  const scores = useMemo(
    () =>
      scoreConfig.map((item) => ({
        ...item,
        value:
          scorecard?.[item.key] ??
          (item.key === 'overall_score' ? 94 : 90),
      })),
    [scorecard],
  );

  useEffect(() => {
    if (!scorecard) {
      return;
    }

    const currentSignature = JSON.stringify(scorecard);

    if (previousSignatureRef.current && previousSignatureRef.current === currentSignature) {
      return;
    }

    previousSignatureRef.current = currentSignature;
    setAnimateCards(true);
  }, [scorecard]);

  useEffect(() => {
    if (!animateCards) {
      return;
    }

    const timer = window.setTimeout(() => setAnimateCards(false), 900);
    return () => window.clearTimeout(timer);
  }, [animateCards]);

  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {scores.map((score, index) => {
        const Icon = score.icon;
        const isEntering = animateCards && Boolean(scorecard);

        return (
          <motion.article
            key={score.label}
            initial={isEntering ? { opacity: 0, y: 12 } : false}
            animate={isEntering ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            transition={{
              duration: 0.45,
              delay: isEntering ? index * 0.1 : 0,
              ease: 'easeOut',
            }}
            whileHover={{ y: -4, scale: 1.01, boxShadow: '0 18px 40px rgba(2, 6, 23, 0.35)' }}
            className="rounded-2xl border border-slate-800/80 bg-slate-900/80 p-4 shadow-lg shadow-slate-950/20"
          >
            <div className="flex items-center justify-between">
              <div className={`rounded-2xl bg-gradient-to-br ${score.tone} p-2 text-white shadow-lg`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-slate-400">{score.label}</span>
            </div>

            <div className="mt-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-3xl font-semibold tracking-tight text-slate-100">
                  {score.value}
                </p>
                <p className="text-sm text-slate-500">/ 100</p>
              </div>
            </div>

            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                className={`h-2.5 rounded-full bg-gradient-to-r ${score.tone}`}
                initial={isEntering ? { width: 0 } : { width: `${score.value}%` }}
                animate={{ width: `${score.value}%` }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: isEntering ? index * 0.1 : 0 }}
              />
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {score.detail}
            </p>
          </motion.article>
        );
      })}
    </section>
  );
}