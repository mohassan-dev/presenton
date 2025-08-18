"use client";

import React, { ReactNode, useEffect, useRef } from "react";
import katex from "katex";

interface Props {
  children: ReactNode;
}

const LatexTextRenderer: React.FC<Props> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const shouldIgnore = (el: Element | null) => {
      let cur: Element | null = el;
      while (cur) {
        if (
          (cur as HTMLElement).closest?.(".tiptap-text-editor") ||
          (cur as HTMLElement).getAttribute?.("contenteditable") === "true" ||
          cur.tagName === "SCRIPT" ||
          cur.tagName === "STYLE"
        ) {
          return true;
        }
        cur = cur.parentElement;
      }
      return false;
    };

    const renderLatexInTextNodes = (container: Element) => {
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
      const targets: Text[] = [];
      let n: Node | null;
      while ((n = walker.nextNode())) {
        const t = n as Text;
        if (!t.nodeValue) continue;
        if (shouldIgnore(t.parentElement)) continue;
        if (/\${1,2}[\s\S]+?\${1,2}/.test(t.nodeValue)) targets.push(t);
      }

      for (const textNode of targets) {
        const text = textNode.nodeValue || "";
        const frag = document.createDocumentFragment();
        const regex = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;
        let last = 0;
        let m: RegExpExecArray | null;
        while ((m = regex.exec(text))) {
          if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
          const isBlock = !!m[1];
          const expr = isBlock ? m[1] : m[2];
          const span = document.createElement("span");
          try {
            span.innerHTML = katex.renderToString(expr, {
              displayMode: isBlock,
              throwOnError: false,
              strict: "ignore",
              trust: true,
            });
          } catch {
            span.textContent = isBlock ? `$$${expr}$$` : `$${expr}$`;
          }
          frag.appendChild(span);
          last = m.index + m[0].length;
        }
        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        const parent = textNode.parentNode;
        if (parent) {
          parent.insertBefore(frag, textNode);
          parent.removeChild(textNode);
        }
      }
    };

    renderLatexInTextNodes(root);

    const mo = new MutationObserver((mutations) => {
      for (const mu of mutations) {
        for (const added of Array.from(mu.addedNodes)) {
          if (added instanceof Element) renderLatexInTextNodes(added);
        }
      }
    });
    mo.observe(root, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [children]);

  return <div ref={ref}>{children}</div>;
};

export default LatexTextRenderer;


