"use client";

import Image from "next/image";
import { Deal } from "../libs/types";

export default function DealCard({ deal }: { deal: Deal }) {
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
      {deal.imageURL && (
        <div className="relative w-full h-40">
          <Image
            src={deal.imageURL}
            alt={deal.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-3 space-y-1">
        <div className="font-semibold text-sm">{deal.title}</div>
        <div className="text-xs text-slate-300 line-clamp-2">
          {deal.description}
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="font-bold text-base">₹{deal.price}</span>
          <button className="text-xs bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-3 py-1 rounded-full">
            View Offer
          </button>
        </div>
      </div>
    </div>
  );
}
