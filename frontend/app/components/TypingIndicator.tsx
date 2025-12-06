export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 text-xs text-zinc-500 mt-2">
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce" />
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce delay-150" />
      <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 animate-bounce delay-300" />
      <span className="ml-1">Bot is typing...</span>
    </div>
  );
}
