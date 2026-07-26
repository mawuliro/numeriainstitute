"use client";

import { useState, useRef, useCallback } from "react";
import { Play, RotateCcw, Copy, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SandboxBlock({ title, code }: { title: string; code: string }) {
  const [output, setOutput] = useState<string>("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [loadingPyodide, setLoadingPyodide] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pyodideRef = useRef<unknown>(null);

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;

    setLoadingPyodide(true);

    const PYODIDE_VERSION = "0.26.2";
    const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

    try {
      // Load script if not present
      if (!(window as unknown as Record<string, unknown>).loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = `${PYODIDE_CDN}pyodide.js`;
          script.onload = () => resolve();
          script.onerror = () =>
            reject(
              new Error(
                "Impossible de charger Pyodide depuis le CDN. Vérifie ta connexion internet (le fichier fait ~10 Mo).",
              ),
            );
          document.head.appendChild(script);
        });
      }

      // Pass indexURL so Pyodide can find its WASM files
      const py = await (window as unknown as Record<string, (opts: { indexURL: string }) => Promise<unknown>>).loadPyodide({
        indexURL: PYODIDE_CDN,
      });
      await (py as { loadPackage: (pkgs: string[]) => Promise<void> }).loadPackage([
        "matplotlib",
        "numpy",
      ]);
      pyodideRef.current = py;
      setPyodideReady(true);
      return py;
    } finally {
      setLoadingPyodide(false);
    }
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
    <div className="rounded-2xl border border-[#1B2A4E]/20 overflow-hidden shadow-md">
      {/* Header — branded */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-[#1B2A4E] to-[#2DD4BF]/10 px-4 py-3 border-b border-[#1B2A4E]/20">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2DD4BF]/15 ring-1 ring-[#2DD4BF]/30">
          <span className="text-sm">🐍</span>
        </span>
        <span className="font-semibold text-sm text-white">{title}</span>
        <div className="ml-auto flex items-center gap-1.5">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigator.clipboard.writeText(code)}
            className="h-7 text-xs text-white/70 hover:text-white hover:bg-white/10"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={reset}
            className="h-7 text-xs text-white/70 hover:text-white hover:bg-white/10"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            onClick={runCode}
            disabled={running || loadingPyodide}
            className="h-7 text-xs bg-[#2DD4BF] text-[#1B2A4E] hover:bg-[#2DD4BF]/80 font-semibold"
          >
            {loadingPyodide ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Chargement Python... (~10s)
              </>
            ) : running ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Exécution...
              </>
            ) : (
              <>
                <Play className="h-3 w-3" />
                {pyodideReady ? "Exécuter" : "Exécuter"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Code editor */}
      <div className="bg-[#0f172a] p-4 overflow-x-auto">
        <pre className="text-sm text-gray-100 font-mono leading-relaxed">
          <code>{code.replace(/\\n/g, "\n")}</code>
        </pre>
      </div>

      {/* Output */}
      {(output || imageData || error) && (
        <div className="border-t border-border bg-muted/30 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Résultat</p>
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-300 font-mono border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}
          {imageData && (
            <div className="mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageData}
                alt="Résultat de la simulation"
                className="w-full rounded-lg border bg-white"
              />
            </div>
          )}
          {output && !imageData && (
            <pre className="text-sm font-mono text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-white dark:bg-gray-900 p-3 rounded-lg border">
              {output}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
