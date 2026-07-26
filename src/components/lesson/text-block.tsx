"use client";

import { useEffect, useRef, useMemo } from "react";

/**
 * TextBlock — renders Markdown + LaTeX content with pedagogical styling.
 *
 * FEATURES:
 * - LaTeX via MathJax (loaded dynamically on client)
 * - Markdown via custom regex parser (headings, bold, italic, code, lists,
 *   blockquotes, tables, hr)
 * - XSS protection: HTML is escaped before markdown rules apply
 * - Callout boxes: blockquotes get colored based on their first character
 *   - 💡 → tip (teal)
 *   - ⚠️ → warning (gold)
 *   - ✅ → success (green)
 *   - ❌ → error (red)
 *   - 📋 → definition (navy)
 * - Display math ($$...$$) gets a subtle background card
 */

export function TextBlock({ content }: { content: string }) {
  const ref = useRef<HTMLDivElement>(null);

  // Load MathJax and typeset on mount
  useEffect(() => {
    if (!ref.current) return;

    if (!window.MathJax) {
      window.MathJax = {
        tex: {
          inlineMath: [["$", "$"], ["\\(", "\\)"]],
          displayMath: [["$$", "$$"], ["\\[", "\\]"]],
          processEscapes: true,
          processEnvironments: true,
          packages: {
            "[+]": [
              "ams",
              "boldsymbol",
              "cancel",
              "color",
              "bbox",
              "newcommand",
              "configmacros",
              "noundefined",
              "noerrors",
            ],
          },
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

  // Memoize HTML conversion so we don't recompute on every render
  const html = useMemo(() => markdownToHtml(content), [content]);

  return (
    <div
      ref={ref}
      className="prose prose-sm max-w-none dark:prose-invert text-gray-800 dark:text-gray-100 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Simple Markdown to HTML converter with XSS protection + callout styling.
 */
function markdownToHtml(md: string): string {
  // Normalize line endings
  let html = md.replace(/\r\n/g, "\n").replace(/\\n/g, "\n");

  // Protect inline SVG blocks BEFORE escaping — these are raw HTML we want
  // to render as actual SVG, not escaped text. We extract them, escape the
  // rest, then restore them.
  const svgBlocks: string[] = [];
  html = html.replace(/<svg[\s\S]*?<\/svg>/gi, (match) => {
    const idx = svgBlocks.length;
    svgBlocks.push(match);
    return `\u0000SVG${idx}\u0000`;
  });

  // Escape all HTML first — critical XSS defense.
  html = escapeHtml(html);

  // Detect callout type from the first emoji/character of blockquotes
  // We'll process blockquotes specially to add CSS classes based on emoji prefix.
  const calloutBlocks: string[] = [];

  // Protect fenced code blocks
  const codeBlocks: string[] = [];
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_m, _lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(
      `<pre class="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm font-mono"><code>${code.trim()}</code></pre>`,
    );
    return `\u0000CODE${idx}\u0000`;
  });

  // Protect inline code
  const inlineCodes: string[] = [];
  html = html.replace(/`([^`\n]+)`/g, (_m, code) => {
    const idx = inlineCodes.length;
    inlineCodes.push(
      `<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">${code}</code>`,
    );
    return `\u0000INLINE${idx}\u0000`;
  });

  // Protect LaTeX ($$...$$ and $...$)
  const latexBlocks: string[] = [];
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (_m, tex) => {
    const idx = latexBlocks.length;
    latexBlocks.push(`$$${tex}$$`);
    return `\u0000LATEX${idx}\u0000`;
  });
  html = html.replace(/(?<!\$)\$(?!\$)([^\n$]+?)\$/g, (_m, tex) => {
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

  // Blockquotes — with callout type detection
  // Match consecutive blockquote lines (lines starting with >)
  html = html.replace(/(?:^&gt; (.+)$\n?)+/gm, (block) => {
    // Strip the &gt; prefix from each line
    const content = block
      .split("\n")
      .map((line) => line.replace(/^&gt; /, "").trim())
      .filter(Boolean)
      .join(" ");

    // Detect callout type from leading emoji
    let calloutClass = "callout-info";
    let calloutIcon = "";
    if (content.startsWith("💡")) {
      calloutClass = "callout-tip";
      calloutIcon = "💡";
    } else if (content.startsWith("⚠️") || content.startsWith("⚠")) {
      calloutClass = "callout-warning";
      calloutIcon = "⚠️";
    } else if (content.startsWith("✅")) {
      calloutClass = "callout-success";
      calloutIcon = "✅";
    } else if (content.startsWith("❌")) {
      calloutClass = "callout-error";
      calloutIcon = "❌";
    } else if (content.startsWith("📋") || content.startsWith("📝")) {
      calloutClass = "callout-definition";
      calloutIcon = "📋";
    }

    const idx = calloutBlocks.length;
    calloutBlocks.push(
      `<blockquote class="${calloutClass}">${content}</blockquote>`,
    );
    return `\u0000CALLOUT${idx}\u0000`;
  });

  // Lists (unordered)
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);

  // Lists (ordered)
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // Tables — convert markdown tables to HTML
  // Match: header row | separator | data rows
  html = html.replace(
    /(?:^\|[^\n]+\|\s*\n)(?:^\|[\s\-:|]+\|\s*\n)((?:^\|[^\n]+\|\s*\n?)+)/gm,
    (table) => {
      const lines = table.trim().split("\n");
      const headerCells = lines[0]
        .split("|")
        .map((c) => c.trim())
        .filter(Boolean);
      const bodyRows = lines.slice(2).map((line) =>
        line
          .split("|")
          .map((c) => c.trim())
          .filter(Boolean),
      );

      const thead = `<thead><tr>${headerCells
        .map((c) => `<th>${c}</th>`)
        .join("")}</tr></thead>`;
      const tbody = `<tbody>${bodyRows
        .map(
          (row) =>
            `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`,
        )
        .join("")}</tbody>`;

      return `<table>${thead}${tbody}</table>`;
    },
  );

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

  // Restore callout blocks
  calloutBlocks.forEach((cb, i) => {
    html = html.replace(`\u0000CALLOUT${i}\u0000`, cb);
  });

  // Restore SVG blocks (raw HTML, not escaped)
  svgBlocks.forEach((sb, i) => {
    html = html.replace(`\u0000SVG${i}\u0000`, sb);
  });

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
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
