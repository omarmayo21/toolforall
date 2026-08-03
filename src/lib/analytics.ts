export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
    const pathSegments = window.location.pathname.split("/").filter(Boolean);
    
    if (pathSegments.length >= 2) {
      if (!params.tool_name) params.tool_name = pathSegments[pathSegments.length - 1];
      if (!params.category) params.category = pathSegments[0];
    }

    (window as any).gtag("event", eventName, params);
  }
};

let lastToolUsedPath = "";
export const trackToolUsed = () => {
  if (typeof window === "undefined") return;
  const currentPath = window.location.pathname;
  if (lastToolUsedPath === currentPath) return;
  lastToolUsedPath = currentPath;
  trackEvent("tool_used");
};
