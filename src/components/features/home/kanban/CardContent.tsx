import React, { useMemo } from "react";
import { Inquiry } from "@/interfaces/inquiry";
import { yyyymmddToRelative } from "@/utils/dateFormating/yyyymmddToRelative";

const CardContent = ({ item }: { item: Inquiry }) => {
  const isHighValue = (item.potentialValue || 0) > 50000;

  const formattedDate = useMemo(
    () => yyyymmddToRelative(item.eventDate),
    [item.eventDate]
  );

  return (
    <div
      className={`relative rounded-md border bg-white p-3 shadow-sm ${
        isHighValue ? "border-emerald-200" : "border-zinc-200"
      }`}
    >
      {isHighValue && (
        <div
          className="absolute -top-1 -right-1 flex h-3 w-3"
          title="High Value (>50K)"
        >
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
        </div>
      )}
      <div className="flex items-center justify-between gap-2 text-sm font-semibold text-zinc-900">
        <span className="truncate">{item.clientName}</span>
        <span className="text-xs font-medium text-zinc-500">{item.id}</span>
      </div>
      <div className="mt-1 flex items-center justify-between text-xs text-zinc-700">
        <span className="font-medium">{item.eventType}</span>
        <span>{formattedDate}</span>
      </div>
      <div className="mt-1 text-[11px] text-zinc-500">
        <span>{item.contactPerson}</span>
        <span className="mx-1">•</span>
        <span>{item.guestCount} guests</span>
        <span className="mx-1">•</span>
        <span className={isHighValue ? "font-bold text-emerald-600" : ""}>
          ${item.potentialValue?.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default CardContent;
