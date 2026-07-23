// Global type augmentations for Numeria Institute.

// MathJax is loaded dynamically on the client for LaTeX rendering.
interface MathJaxObject {
  typesetPromise?: (elements?: (HTMLElement | Document)[]) => Promise<void>;
  tex?: {
    inlineMath?: [string, string][];
    displayMath?: [string, string][];
    processEscapes?: boolean;
    processEnvironments?: boolean;
    packages?: { "[+]": string[] };
  };
  options?: { skipHtmlTags?: string[] };
}

interface Window {
  MathJax?: MathJaxObject;
}
