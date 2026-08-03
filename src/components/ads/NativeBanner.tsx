"use client";

import { useEffect, useRef } from "react";

export default function NativeBanner() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || iframe.getAttribute("data-loaded")) return;

    const injectAd = () => {
      const doc = iframe.contentWindow?.document;
      if (!doc) return;

      iframe.setAttribute("data-loaded", "true");

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body { margin: 0; padding: 0; background: transparent; }
            </style>
          </head>
          <body>
            <script async="async" data-cfasync="false" src="https://pl30655447.effectivecpmnetwork.com/2094ef0cdb65adde452f638db2450630/invoke.js"></script>
            <div id="container-2094ef0cdb65adde452f638db2450630"></div>
          </body>
        </html>
      `;

      doc.open();
      doc.write(html);
      doc.close();
    };

    requestAnimationFrame(injectAd);
  }, []);

  return (
    <div className="w-full min-h-[250px] flex justify-center overflow-hidden">
      <iframe
        ref={iframeRef}
        title="Advertisement"
        className="w-full h-full min-h-[250px]"
        style={{ border: "none" }}
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
      />
    </div>
  );
}
