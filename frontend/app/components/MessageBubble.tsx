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
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-md ${
          isUser
            ? "bg-blue-600 text-white rounded-br-sm"
            : "bg-slate-800 text-slate-50 rounded-bl-sm"
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
              <div className="text-xs text-slate-400">No deals available at the moment.</div>
            )}
          </div>
        )}

        {payload?.type === "orders" && (
          <div className="mt-3 space-y-1 text-xs opacity-90">
            {payload.orders.map((o: any) => (
              <div
                key={o._id}
                className="border border-slate-700 rounded-lg px-2 py-1"
              >
                <div className="font-semibold">{o.productName}</div>
                <div className="text-[10px] uppercase">{o.status}</div>
              </div>
            ))}
          </div>
        )}

        {payload?.type === "payments" && (
          <div className="mt-3 space-y-1 text-xs opacity-90">
            {payload.payments.map((p: any) => (
              <div
                key={p._id}
                className="border border-slate-700 rounded-lg px-2 py-1"
              >
                <div>Paid: ₹{p.amountPaid}</div>
                <div>Pending: ₹{p.pendingAmount}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
