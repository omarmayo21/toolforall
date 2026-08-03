"use client";


import { useEffect, useState } from "react";
import Banner728 from "./ads/Banner728";
import Banner300 from "./ads/Banner300";
import Banner320 from "./ads/Banner320";
import NativeBanner from "./ads/NativeBanner";


type AdSlotProps = {
  slot: "hero" | "after-tool" | "after-article" | "bottom";
};

// Current Ad Provider configuration
// Switch this to "adsterra" or "adsense" when ready to integrate real ads.
const AD_PROVIDER: "adsterra" | "adsense" | "none" = "adsterra";



export default function AdSlot({ slot }: AdSlotProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (AD_PROVIDER === "none") {
    return null;
  }

  // Responsive min-heights to prevent Cumulative Layout Shift (CLS) when ads load.
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

  const renderAdsterra = () => {
    switch (slot) {
      case "hero":
        return isMobile ? <Banner320 /> : <Banner728 />;
      case "after-tool":
        return <Banner300 />;
      case "after-article":
        return <NativeBanner />;
      case "bottom":
        return <Banner300 />;
      default:
        return null;
    }
  };

  return (
    <div 
      aria-hidden="true" 
      className={`my-8 flex w-full justify-center overflow-hidden ${minHeightClass}`}
    >
      {AD_PROVIDER === "adsterra" && renderAdsterra()}
    </div>
  );
}
