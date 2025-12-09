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
          <div className="mt-3 space-y-3">
            {payload.orders.map((o: any) => (
              <div
                key={o._id}
                className="border border-zinc-800 rounded-lg p-3 bg-zinc-900"
              >
                <div className="flex gap-3">
                  {/* Product Image */}
                  <div className="w-12 h-12 bg-zinc-700 rounded-lg flex-shrink-0 overflow-hidden">
                    {o.dealId?.imageURL ? (
                      <img
                        src={o.dealId.imageURL}
                        alt={o.dealId?.title || "Product"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-zinc-100 text-sm truncate">
                      {o.dealId?.title || "Unknown Product"}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">
                      ₹{o.totalAmount?.toLocaleString()} • Qty: {o.quantity}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        o.status === 'completed' ? 'bg-green-400/10 text-green-400' :
                        o.status === 'confirmed' ? 'bg-blue-400/10 text-blue-400' :
                        o.status === 'processing' ? 'bg-purple-400/10 text-purple-400' :
                        o.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' :
                        'bg-red-400/10 text-red-400'
                      }`}>
                        {o.status.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
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
