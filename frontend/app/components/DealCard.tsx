"use client";

import Image from "next/image";
import { Deal } from "../libs/types";

export default function DealCard({ deal }: { deal: Deal }) {
  return (
    <div className="bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800">
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
      <div className="p-4 space-y-2">
        <div className="font-semibold text-sm text-zinc-100">{deal.title}</div>
        <div className="text-xs text-zinc-400 line-clamp-2">
          {deal.description}
        </div>
        <div className="flex items-center justify-between pt-2">
          <span className="font-bold text-base text-zinc-100">₹{deal.price}</span>
          <button className="text-xs bg-white hover:bg-zinc-200 text-black font-semibold px-4 py-1.5 rounded-md transition-colors">
            View Offer
          </button>
        </div>
      </div>
    </div>
  );
}
