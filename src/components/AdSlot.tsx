"use client";

type AdSlotProps = {
  slot: "hero" | "after-tool" | "after-article" | "bottom";
};

// Current Ad Provider configuration
// Switch this to "adsterra" or "adsense" when ready to integrate real ads.
const AD_PROVIDER: "adsterra" | "adsense" | "none" = "none";

export default function AdSlot({ slot }: AdSlotProps) {
  if (AD_PROVIDER === "none") {
    return null;
  }

  // Responsive min-heights to prevent Cumulative Layout Shift (CLS) when ads load.
  // Standard sizes: 
  // Desktop leaderboard is usually 90px tall. 
  // Mobile banner is usually 50px tall (hero) or 250px tall (medium rectangle).
  let minHeightClass = "";
  switch (slot) {
    case "hero":
      minHeightClass = "min-h-[50px] md:min-h-[90px]";
      break;
    case "after-tool":
    case "after-article":
    case "bottom":
      minHeightClass = "min-h-[250px] md:min-h-[90px]";
      break;
  }

  return (
    <div 
      aria-hidden="true" 
      className={`my-8 flex w-full justify-center overflow-hidden ${minHeightClass}`}
    >
      {/* 
        Future integration points:
        if (AD_PROVIDER === "adsense") { ... }
        if (AD_PROVIDER === "adsterra") { ... }
      */}
    </div>
  );
}
