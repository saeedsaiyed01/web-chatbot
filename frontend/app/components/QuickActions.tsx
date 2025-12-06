"use client";

type Props = {
  onAction: (text: string) => void;
};

const actions = [
  { label: "New Deals", text: "show deals" },
  { label: "My Orders", text: "my orders" },
  { label: "Payment Status", text: "payment status" },
  { label: "Help", text: "help" }
];

export default function QuickActions({ onAction }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={() => onAction(a.text)}
          className="text-xs border border-slate-700 bg-slate-900 px-3 py-1 rounded-full hover:bg-slate-800"
        >
          {a.label}
        </button>
      ))}
    </div>
  );
}
