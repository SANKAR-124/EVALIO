import { useState } from 'react';

const colors = {
  ink: '#16130f',
  panel: '#1d1912',
  panel2: '#241f16',
  hair: '#3a3223',
  amber: '#e8a33d',
  amberBright: '#ffc266',
  amberDim: '#7a5a26',
  text: '#f1e8d8',
  textDim: '#9a8f78',
  err: '#d9614f',
};

const USE_CASES = [
  'Image Gen', 'Video Gen', 'Backend Dev', 'UI Dev', 'Data Analysis',
  'Content Writing', 'Code Review', 'ML', 'Agent',
];

const MODELS = ['Claude', 'ChatGPT', 'Gemini', 'LLaMA'];

const FEATURES = [
  {
    title: 'Prompt optimization',
    body: 'Turn a rough one-liner into a structured brief — constraints, output format, and worked examples added automatically.',
  },
  {
    title: 'Scorecard grading',
    body: 'Every run is scored out of 100 against clarity, completeness, and constraint coverage, so you know a prompt works before you ship it.',
  },
  {
    title: 'Cross-model scanner',
    body: 'Run the same prompt against Claude, ChatGPT, Gemini, and LLaMA side by side and see where they diverge.',
  },
  {
    title: 'Session history',
    body: 'Every prompt, optimization, and score is kept in a running history you can revisit, fork, or roll back.',
  },
  {
    title: 'Use-case templates',
    body: 'Starting points tuned for backend dev, UI dev, data analysis, content writing, code review, ML, and agent work.',
  },
  {
    title: 'Structured output specs',
    body: 'Define response envelopes, pagination rules, and schema requirements once, and reuse them across every prompt.',
  },
];

function IconBolt() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill={colors.amber} />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Landing({ onContinue }) {
      const [hoveredFeature, setHoveredFeature] = useState(null);

  return (
    <div style={styles.page}>
      <style>{fontImport}</style>

      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <span style={styles.navDot} />
          <span style={styles.navLogo}>Evalio</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.navLink}>Product</span>
          <span style={styles.navLink}>Models</span>
          <span style={styles.navLink}>Docs</span>
          <button style={styles.navCta} onClick={onContinue}>
            Enter workspace <IconArrow />
          </button>
        </div>
      </nav>

      <header style={styles.hero}>
        <div style={styles.heroBadge}>
          <IconBolt /> <span>Prompt evaluation, built for shipping</span>
        </div>
        <h1 style={styles.heroTitle}>
          Know your prompt works<br />before it hits production.
        </h1>
        <p style={styles.heroSub}>
          Evalio scores, optimizes, and scans every prompt you write across Claude, ChatGPT,
          Gemini, and LLaMA — so you stop guessing and start shipping prompts you can trust.
        </p>
        <div style={styles.heroActions}>
          <button style={styles.primaryBtn} onClick={onContinue}>
            Get started <IconArrow />
          </button>
          <button style={styles.secondaryBtn}>See how it works</button>
        </div>

        <div style={styles.terminalPreview}>
          <div style={styles.terminalBar}>
            <span style={styles.dot} /><span style={styles.dot} /><span style={styles.dot} />
            <span style={styles.terminalTitle}>prompt-1.eval</span>
            <span style={styles.terminalScore}>SCORE: 78/100</span>
          </div>
          <div style={styles.terminalBody}>
            <div style={styles.terminalLine}><span style={styles.terminalDim}>&gt; </span>Build me a REST API for a task management app</div>
            <div style={{ ...styles.terminalLine, color: colors.amber }}>&lt;constraints&gt;</div>
            <div style={styles.terminalLine}>&nbsp;&nbsp;- All endpoints must require authentication except /health and /auth/login</div>
            <div style={styles.terminalLine}>&nbsp;&nbsp;- Input validation on every user-supplied field</div>
            <div style={styles.terminalLine}>&nbsp;&nbsp;- No raw SQL — use ORM exclusively</div>
            <div style={{ ...styles.terminalLine, color: colors.amber }}>&lt;/constraints&gt;</div>
          </div>
        </div>
      </header>

      <section style={styles.modelsSection}>
        <p style={styles.sectionEyebrow}>Evaluate across every model you already use</p>
        <div style={styles.modelRow}>
          {MODELS.map((m) => (
            <div key={m} style={styles.modelChip}>{m}</div>
          ))}
        </div>
      </section>

      <section style={styles.featuresSection}>
        <p style={styles.sectionEyebrow}>What Evalio does</p>
        <h2 style={styles.sectionTitle}>Everything between a rough idea and a reliable prompt</h2>
        <div style={styles.featureGrid}>
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              style={{
                ...styles.featureCard,
                borderColor: hoveredFeature === i ? colors.amberDim : colors.hair,
              }}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <span style={styles.featureIndex}>{String(i + 1).padStart(2, '0')}</span>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureBody}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.useCaseSection}>
        <p style={styles.sectionEyebrow}>Built for how your team already works</p>
        <div style={styles.useCaseRow}>
          {USE_CASES.map((u) => (
            <span key={u} style={styles.useCaseChip}>{u}</span>
          ))}
        </div>
      </section>

      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Stop shipping prompts on a hunch.</h2>
        <p style={styles.ctaSub}>Set up your workspace and run your first evaluation in under a minute.</p>
        <button style={styles.primaryBtn} onClick={onContinue}>
          Enter workspace <IconArrow />
        </button>
      </section>

      <footer style={styles.footer}>
        <span>&copy; {new Date().getFullYear()} Evalio</span>
        <span style={styles.footerDim}>Prompt evaluation and optimization</span>
      </footer>
    </div>
  );
}

const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap');
`;

const styles = {
  page: {
    background: colors.ink,
    color: colors.text,
    fontFamily: "'IBM Plex Mono', monospace",
    minHeight: '100vh',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 40px',
    borderBottom: `1px solid ${colors.hair}`,
  },
  navLeft: { display: 'flex', alignItems: 'center', gap: 8 },
  navDot: { width: 8, height: 8, borderRadius: '50%', background: colors.amber, display: 'inline-block' },
  navLogo: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 19, color: colors.amberBright },
  navRight: { display: 'flex', alignItems: 'center', gap: 28 },
  navLink: { fontSize: 13, color: colors.textDim, cursor: 'pointer' },
  navCta: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: colors.amber, color: '#241a08', border: 'none',
    borderRadius: 5, padding: '9px 16px', fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
  },
  hero: {
    maxWidth: 760, margin: '0 auto', padding: '88px 24px 56px',
    textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
  },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: colors.panel, border: `1px solid ${colors.hair}`,
    borderRadius: 20, padding: '6px 14px', fontSize: 12, color: colors.textDim,
    marginBottom: 24,
  },
  heroTitle: {
    fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 42,
    lineHeight: 1.2, margin: '0 0 18px', color: colors.text,
  },
  heroSub: {
    fontSize: 14.5, color: colors.textDim, lineHeight: 1.7,
    maxWidth: 560, margin: '0 0 32px',
  },
  heroActions: { display: 'flex', gap: 12, marginBottom: 56 },
  primaryBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: colors.amber, color: '#241a08', border: 'none',
    borderRadius: 5, padding: '12px 20px', fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 13, fontWeight: 600, cursor: 'pointer',
  },
  secondaryBtn: {
    background: 'transparent', color: colors.text, border: `1px solid ${colors.hair}`,
    borderRadius: 5, padding: '12px 20px', fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 13, fontWeight: 500, cursor: 'pointer',
  },
  terminalPreview: {
    width: '100%', textAlign: 'left', background: colors.panel,
    border: `1px solid ${colors.hair}`, borderRadius: 8, overflow: 'hidden',
  },
  terminalBar: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '9px 14px', background: colors.panel2, borderBottom: `1px solid ${colors.hair}`,
  },
  dot: { width: 8, height: 8, borderRadius: '50%', background: colors.hair, display: 'inline-block' },
  terminalTitle: { marginLeft: 8, fontSize: 11.5, color: colors.textDim },
  terminalScore: { marginLeft: 'auto', fontSize: 11, color: colors.amber },
  terminalBody: { padding: '16px 18px', fontSize: 12.5, lineHeight: 2 },
  terminalLine: { color: colors.text },
  terminalDim: { color: colors.textDim },
  modelsSection: { textAlign: 'center', padding: '40px 24px' },
  sectionEyebrow: { fontSize: 12, color: colors.textDim, letterSpacing: '0.04em', marginBottom: 20 },
  modelRow: { display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' },
  modelChip: {
    border: `1px solid ${colors.hair}`, borderRadius: 20, padding: '8px 18px',
    fontSize: 13, color: colors.text, background: colors.panel,
  },
  featuresSection: { maxWidth: 1040, margin: '0 auto', padding: '56px 24px', textAlign: 'center' },
  sectionTitle: {
    fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 26,
    color: colors.text, margin: '0 0 40px',
  },
  featureGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 16, textAlign: 'left',
  },
  featureCard: {
    background: colors.panel, border: `1px solid ${colors.hair}`,
    borderRadius: 8, padding: '20px 20px 22px', transition: 'border-color 0.15s ease',
  },
  featureIndex: { fontSize: 11, color: colors.amberDim },
  featureTitle: { fontSize: 15, fontWeight: 500, color: colors.text, margin: '10px 0 8px' },
  featureBody: { fontSize: 12.5, color: colors.textDim, lineHeight: 1.7, margin: 0 },
  useCaseSection: { textAlign: 'center', padding: '40px 24px 64px' },
  useCaseRow: { display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap', maxWidth: 720, margin: '0 auto' },
  useCaseChip: {
    border: `1px solid ${colors.hair}`, borderRadius: 5, padding: '7px 14px',
    fontSize: 12.5, color: colors.textDim,
  },
  ctaSection: {
    textAlign: 'center', padding: '64px 24px', borderTop: `1px solid ${colors.hair}`,
  },
  ctaTitle: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 26, margin: '0 0 10px', color: colors.text },
  ctaSub: { fontSize: 13.5, color: colors.textDim, margin: '0 0 24px' },
  footer: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 40px', borderTop: `1px solid ${colors.hair}`,
    fontSize: 11.5, color: colors.textDim,
  },
  footerDim: { color: colors.textDim },
};