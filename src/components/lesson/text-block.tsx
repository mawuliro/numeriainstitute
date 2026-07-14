"use client";

import { useEffect, useRef } from "react";

/**
 * TextBlock — renders Markdown + LaTeX content.
 * Uses a lightweight approach: we load MathJax on the client to render
 * $...$ and $$...$$ LaTeX. Markdown is parsed with a simple regex-based
 * converter (headings, bold, italic, code, lists, blockquotes).
 */

export function TextBlock({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);

  // Load MathJax and typeset on mount
  useEffect(() => {
    if (!ref.current) return;

    // Ensure MathJax is loaded
    if (!window.MathJax) {
      window.MathJax = {
        tex: {
          inlineMath: [["$", "$"], ["\\(", "\\)"]],
          displayMath: [["$$", "$$"], ["\\[", "\\]"]],
          processEscapes: true,
          processEnvironments: true,
          packages: { "[+]": ["ams", "boldsymbol", "cancel", "color", "bbox", "newcommand", "configmacros", "noundefined", "noerrors"] },
        },
        options: {
          skipHtmlTags: ["script", "noscript", "style", "textarea", "pre", "code"],
        },
      };
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js";
      script.async = true;
      script.onload = () => {
        if (window.MathJax?.typesetPromise && ref.current) {
          window.MathJax.typesetPromise([ref.current]).catch(() => {});
        }
      };
      document.head.appendChild(script);
    } else if (window.MathJax?.typesetPromise && ref.current) {
      window.MathJax.typesetPromise([ref.current]).catch(() => {});
    }
  }, [content]);

  const html = markdownToHtml(content);

  return (
    <div
      ref={ref}
      className="prose prose-sm max-w-none dark:prose-invert text-gray-800 dark:text-gray-100 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Simple Markdown to HTML converter.
 * Handles: headings, bold, italic, code, lists, blockquotes, callouts.
 */
function markdownToHtml(md: string): string {
  // Convert literal \n to actual newlines (DB stores them as literal \n)
  let html = md.replace(/\\n/g, "\n");

  // Protect fenced code blocks
  const codeBlocks: string[] = [];
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(
      `<pre class="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm font-mono"><code>${escapeHtml(code.trim())}</code></pre>`,
    );
    return `\u0000CODE${idx}\u0000`;
  });

  // Protect inline code
  const inlineCodes: string[] = [];
  html = html.replace(/`([^`\n]+)`/g, (_, code) => {
    const idx = inlineCodes.length;
    inlineCodes.push(`<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">${escapeHtml(code)}</code>`);
    return `\u0000INLINE${idx}\u0000`;
  });

  // Protect LaTeX ($$...$$ and $...$)
  const latexBlocks: string[] = [];
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (_, tex) => {
    const idx = latexBlocks.length;
    latexBlocks.push(`$$${tex}$$`);
    return `\u0000LATEX${idx}\u0000`;
  });
  html = html.replace(/(?<!\$)\$(?!\$)([^\n$]+?)\$/g, (_, tex) => {
    const idx = latexBlocks.length;
    latexBlocks.push(`$${tex}$`);
    return `\u0000LATEX${idx}\u0000`;
  });

  // Headings
  html = html.replace(/^###### (.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^##### (.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, "<em>$1</em>");

  // Blockquotes (callouts)
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");
  html = html.replace(/<\/blockquote>\n<blockquote>/g, "\n");

  // Lists (unordered)
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);

  // Lists (ordered)
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // Horizontal rule
  html = html.replace(/^---$/gm, "<hr/>");

  // Paragraphs (split by double newline, wrap non-tagged lines)
  html = html
    .split(/\n\n+/)
    .map((block) => {
      if (block.startsWith("<") || block.trim() === "") return block;
      return `<p>${block.trim().replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");

  // Restore code blocks and inline code
  codeBlocks.forEach((cb, i) => {
    html = html.replace(`\u0000CODE${i}\u0000`, cb);
  });
  inlineCodes.forEach((ic, i) => {
    html = html.replace(`\u0000INLINE${i}\u0000`, ic);
  });

  // Restore LaTeX
  latexBlocks.forEach((lb, i) => {
    html = html.replace(`\u0000LATEX${i}\u0000`, lb);
  });

  return html;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
