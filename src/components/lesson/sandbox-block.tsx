"use client";

import { useState, useRef, useCallback } from "react";
import { Play, RotateCcw, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SandboxBlock({ title, code }: { title: string; code: string }) {
  const [output, setOutput] = useState<string>("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pyodideRef = useRef<unknown>(null);

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;

    // Load script if not present
    if (!(window as unknown as Record<string, unknown>).loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Pyodide"));
        document.head.appendChild(script);
      });
    }

    const py = await (window as unknown as Record<string, () => Promise<unknown>>).loadPyodide();
    await (py as { loadPackage: (pkgs: string[]) => Promise<void> }).loadPackage([
      "matplotlib",
      "numpy",
    ]);
    pyodideRef.current = py;
    setPyodideReady(true);
    return py;
  }, []);

  const runCode = useCallback(async () => {
    setRunning(true);
    setError(null);
    setOutput("");
    setImageData(null);

    try {
      const py = await loadPyodide();

      // Capture stdout
      (py as { setStdout: (opts: { batched: (s: string) => void }) => void }).setStdout({
        batched: (s: string) => setOutput((prev) => prev + s + "\n"),
      });

      // Run the code — savefig('plot.png') is intercepted to produce imageData
      const cleanCode = code.replace(/\\n/g, "\n");
      const wrappedCode = `
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import io, base64

${cleanCode}

# Check if a figure was created and save it
buf = io.BytesIO()
plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
buf.seek(0)
img_b64 = base64.b64encode(buf.read()).decode()
print(img_b64)
plt.close('all')
`;

      await (py as { runPythonAsync: (code: string) => Promise<void> }).runPythonAsync(wrappedCode);

      // Get the last output line as base64 image
      const pyAny = py as { globals: { get: (key: string) => unknown } };
      const imgResult = pyAny.globals.get("img_b64");
      if (imgResult) {
        setImageData(`data:image/png;base64,${imgResult}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setRunning(false);
    }
  }, [code, loadPyodide]);

  const reset = () => {
    setOutput("");
    setImageData(null);
    setError(null);
  };

  return (
    <div className="rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 bg-muted/50 px-4 py-2.5 border-b">
        <span className="text-base">🐍</span>
        <span className="font-semibold text-sm">{title}</span>
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigator.clipboard.writeText(code)}
            className="h-7 text-xs"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={reset}
            className="h-7 text-xs"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            onClick={runCode}
            disabled={running}
            className="h-7 text-xs bg-[#2DD4BF] text-[#1B2A4E] hover:bg-[#2DD4BF]/80"
          >
            <Play className="h-3 w-3" />
            {running ? "Exécution..." : "Exécuter"}
          </Button>
        </div>
      </div>

      {/* Code editor */}
      <div className="bg-gray-900 p-4 overflow-x-auto">
        <pre className="text-sm text-gray-100 font-mono leading-relaxed">
          <code>{code.replace(/\\n/g, "\n")}</code>
        </pre>
      </div>

      {/* Output */}
      {(output || imageData || error) && (
        <div className="border-t bg-white dark:bg-gray-900 p-4">
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-300 font-mono">
              {error}
            </div>
          )}
          {imageData && (
            <div className="mb-3">
              <img
                src={imageData}
                alt="Résultat de la simulation"
                className="w-full rounded-lg border"
              />
            </div>
          )}
          {output && !imageData && (
            <pre className="text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {output}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
