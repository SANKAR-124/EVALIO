export default function Loader() {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:-0.2s]" />
      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-violet-400 [animation-delay:-0.1s]" />
      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-fuchsia-400" />
    </div>
  );
}