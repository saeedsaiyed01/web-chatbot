"use client";

type Props = {
  onAction: (text: string) => void;
};

const actions = [
  { label: "New Deals", text: "show deals" },
  { label: "My Orders", text: "my orders" },
  { label: "Orders 300-400", text: "show me orders with 300-400 range" },
  { label: "Payment Status", text: "payment status" },
  { label: "Help", text: "help" }
];

export default function QuickActions({ onAction }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={() => onAction(a.text)}
          className="text-xs border border-zinc-700 bg-transparent text-zinc-400 px-3 py-1.5 rounded-md hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
