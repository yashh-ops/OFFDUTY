import { useState } from "react";
import { X } from "lucide-react";

const MESSAGES = [
  "FREE SHIPPING ON ORDERS ABOVE ₹2,999",
  "NEW SEASON ARRIVALS — SHOP THE LATEST DROPS",
  "EASY 30-DAY EXCHANGES",
];

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative flex h-7 items-center justify-center bg-[#20201e] px-10 text-center text-[9px] font-medium uppercase tracking-[0.15em] text-white sm:text-[10px]">
      <p className="truncate">{MESSAGES[0]}</p>

      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
      >
        <X size={12} strokeWidth={1.7} />
      </button>
    </div>
  );
}
