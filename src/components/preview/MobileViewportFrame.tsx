import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";

interface MobileViewportFrameProps {
  width?: number;
  height?: number;
  className?: string;
  children: ReactNode;
}

export default function MobileViewportFrame({
  width = 428,
  height = 928,
  className = "",
  children,
}: MobileViewportFrameProps) {
  const [iframeElement, setIframeElement] = useState<HTMLIFrameElement | null>(
    null,
  );
  const mountedRootRef = useRef<Root | null>(null);
  const [mounted, setMounted] = useState(false);

  const srcDoc = useMemo(
    () =>
      "<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1' /><style>html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:#fff}#root{width:100%;height:100%;overflow-y:scroll;overflow-x:hidden;scrollbar-width:none;-ms-overflow-style:none}#root::-webkit-scrollbar{display:none}</style></head><body><div id='root'></div></body></html>",
    [],
  );

  useEffect(() => {
    if (!iframeElement) return;

    let cancelled = false;

    const mountIntoIframe = () => {
      const iframeDocument = iframeElement.contentDocument;
      if (!iframeDocument) return false;

      const root = iframeDocument.getElementById("root") as HTMLElement | null;
      if (!root) return false;

      // Unmount previous if any
      mountedRootRef.current?.unmount();
      mountedRootRef.current = createRoot(root);

      // Clone stylesheets and style tags for visual parity
      const parentHeadNodes = Array.from(document.head.children);
      parentHeadNodes.forEach((node) => {
        if (node.tagName === "STYLE" || node.tagName === "LINK") {
          const clone = node.cloneNode(true);
          if (clone instanceof Node) {
            iframeDocument.head.appendChild(clone);
          }
        }
      });

      // Initial render
      mountedRootRef.current.render(children);
      setMounted(true);
      return true;
    };

    const handleLoad = () => {
      if (cancelled) return;
      mountIntoIframe();
    };

    // If iframe already has content loaded, try mounting immediately
    try {
      if (!mountIntoIframe()) {
        iframeElement.addEventListener("load", handleLoad);
      }
    } catch (e) {
      // fallback: wait for load event
      iframeElement.addEventListener("load", handleLoad);
    }

    return () => {
      cancelled = true;
      try {
        iframeElement.removeEventListener("load", handleLoad);
      } catch (e) {
        // ignore
      }
      mountedRootRef.current?.unmount();
      mountedRootRef.current = null;
      setMounted(false);
    };
  }, [iframeElement, children]);

  return (
    <div style={{ width, height, position: "relative" }} className={className}>
      <iframe
        ref={setIframeElement}
        title="Mobile Preview"
        sandbox="allow-same-origin"
        width={width}
        height={height}
        srcDoc={srcDoc}
        className="block"
        style={{
          width,
          height,
          border: 0,
          display: "block",
          background: "white",
        }}
      />

      {!mounted && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.8)",
            pointerEvents: "none",
          }}
        >
          <div className="text-sm text-gray-500">Loading preview…</div>
        </div>
      )}
    </div>
  );
}
