export default function StatusBar({ sessionId }) {
  const formattedSessionId = sessionId ? sessionId.slice(-8) : 'pending';

  return (
    <footer className="flex items-center justify-between border-t border-stone-800/80 bg-stone-950/90 px-4 py-1.5 text-[11px] text-stone-500 sm:px-6 lg:px-8">
      <span>Session: sess_{formattedSessionId}</span>
      <div className="flex items-center gap-4">
        <span>UTF-8</span>
        <span>Evalio v3.0</span>
      </div>
    </footer>
  );
}
