"use client";
import { ChatReply } from "../libs/types";
import DealCard from "./DealCard";
type Props = {
  from: "user" | "bot";
  text?: string;
  payload?: ChatReply;
};

export default function MessageBubble({ from, text, payload }: Props) {
  const isUser = from === "user";

  return (
    <div
      className={`flex my-2 ${
        isUser ? "justify-end" : "justify-start"
      } transition-all`}
    >
      <div
        className={`max-w-[80%] rounded-xl px-4 py-2 text-sm ${
          isUser
            ? "bg-zinc-100 text-zinc-900 rounded-tr-sm"
            : "bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-tl-sm"
        }`}
      >
        {text && <p className="whitespace-pre-line">{text}</p>}

        {payload?.type === "deals" && (
          <div className="mt-3 grid gap-3">
            {payload.deals && payload.deals.length > 0 ? (
              payload.deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))
            ) : (
              <div className="text-xs text-zinc-400">No deals available at the moment.</div>
            )}
          </div>
        )}

        {payload?.type === "orders" && (
          <div className="mt-3 space-y-2 text-xs">
            {payload.orders.map((o: any) => (
              <div
                key={o._id}
                className="border border-zinc-800 rounded-lg px-3 py-2 bg-zinc-900"
              >
                <div className="font-semibold text-zinc-100">{o.productName}</div>
                <div className="text-zinc-400 uppercase text-[10px] mt-1">{o.status}</div>
              </div>
            ))}
          </div>
        )}

        {payload?.type === "payments" && (
          <div className="mt-3 space-y-2 text-xs">
            {payload.payments.map((p: any) => (
              <div
                key={p._id}
                className="border border-zinc-800 rounded-lg px-3 py-2 bg-zinc-900"
              >
                <div className="text-zinc-100">Paid: ₹{p.amountPaid}</div>
                <div className="text-zinc-400">Pending: ₹{p.pendingAmount}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
