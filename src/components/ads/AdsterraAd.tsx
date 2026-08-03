"use client";

import { useEffect, useRef } from "react";

type AdsterraAdProps = {
  adKey: string;
  width: number;
  height: number;
};

export default function AdsterraAd({ adKey, width, height }: AdsterraAdProps) {
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
              body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; overflow: hidden; }
            </style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : '${adKey}',
                'format' : 'iframe',
                'height' : ${height},
                'width' : ${width},
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script>
          </body>
        </html>
      `;

      doc.open();
      doc.write(html);
      doc.close();
    };

    requestAnimationFrame(injectAd);
  }, [adKey, height, width]);

  return (
    <iframe
      ref={iframeRef}
      width={width}
      height={height}
      title="Advertisement"
      style={{
        border: "none",
        overflow: "hidden",
        width: "100%",
        maxWidth: `${width}px`,
        height: `${height}px`,
      }}
      sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
    />
  );
}
