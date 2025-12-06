export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-150" />
      <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-300" />
      <span>Bot is typing...</span>
    </div>
  );
}
