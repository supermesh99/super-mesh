"use client";

import { useEffect } from "react";
import { consoleHtml } from "./console.html";
import "./console.css";

export default function ConsolePage() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    // console-app touches window/localStorage — import client-side only
    import("@/lib/console-app").then((m) => {
      cleanup = m.initConsole();
    });
    return () => cleanup?.();
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: consoleHtml }} />;
}
