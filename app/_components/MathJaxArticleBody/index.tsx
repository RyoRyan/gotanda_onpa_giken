"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

type Props = {
  html: string;
  className?: string;
};

declare global {
  interface Window {
    MathJax?: {
      startup?: {
        promise?: Promise<unknown>;
      };
      typesetClear?: (elements?: HTMLElement[]) => void;
      typesetPromise?: (elements?: HTMLElement[]) => Promise<void>;
    };
  }
}

const MATHJAX_CONFIG = `
  window.MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
      displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
      processEscapes: true
    },
    options: {
      skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code']
    }
  };
`;

const typesetMath = async (element: HTMLElement | null) => {
  if (!element || typeof window === "undefined") {
    return;
  }

  const mathJax = window.MathJax;

  if (!mathJax) {
    return;
  }

  await mathJax.startup?.promise;
  mathJax.typesetClear?.([element]);
  await mathJax.typesetPromise?.([element]);
};

export default function MathJaxArticleBody({ html, className }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (!scriptReady) {
      return;
    }

    void typesetMath(contentRef.current);
  }, [html, scriptReady]);

  return (
    <>
      <div
        ref={contentRef}
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <Script id="mathjax-config" strategy="afterInteractive">
        {MATHJAX_CONFIG}
      </Script>
      <Script
        id="mathjax-script"
        src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js"
        strategy="afterInteractive"
        onReady={() => {
          setScriptReady(true);
        }}
      />
    </>
  );
}
