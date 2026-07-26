"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Loader2 } from "lucide-react";

type Slider = {
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit?: string;
};

type Challenge = {
  id: string;
  question: string;
  expected_value: number;
  tolerance: number;
  unit?: string;
  hint?: string;
  explanation?: string;
  next_on_correct?: string | null;
  next_on_wrong?: string | null;
};

type InteractiveLab = {
  id: string;
  title: string;
  instructions?: string;
  simulationCode: string;
  sliderConfigJson: string;
  challengesJson: string;
  points: number;
};

export function LabBlock({ lab }: { lab: InteractiveLab }) {
  const sliders: Slider[] = JSON.parse(lab.sliderConfigJson || "[]");
  const challenges: Challenge[] = JSON.parse(lab.challengesJson || "[]");

  const [sliderValues, setSliderValues] = useState<Record<string, number>>(
    Object.fromEntries(sliders.map((s) => [s.name, s.default])),
  );
  const [running, setRunning] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentChallengeId, setCurrentChallengeId] = useState<string>(
    challenges[0]?.id ?? "",
  );
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [solved, setSolved] = useState<Set<string>>(new Set());

  const pyodideRef = useRef<unknown>(null);

  const loadPyodide = useCallback(async () => {
    if (pyodideRef.current) return pyodideRef.current;

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
    return py;
  }, []);

  const runSimulation = useCallback(async () => {
    setRunning(true);
    setError(null);

    try {
      const py = await loadPyodide();

      const paramsJson = JSON.stringify(sliderValues);
      const cleanCode = lab.simulationCode.replace(/\\n/g, "\n");
      const wrappedCode = `
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import json, io, base64

${cleanCode}

params = json.loads('${paramsJson}')
fig = simulate(params)
buf = io.BytesIO()
fig.savefig(buf, format='png', dpi=100, bbox_inches='tight')
buf.seek(0)
img_b64 = base64.b64encode(buf.read()).decode()
plt.close('all')
`;

      await (py as { runPythonAsync: (code: string) => Promise<void> }).runPythonAsync(wrappedCode);

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
  }, [sliderValues, lab.simulationCode, loadPyodide]);

  const currentChallenge = challenges.find((c) => c.id === currentChallengeId);
  const allSolved = solved.size >= challenges.length;

  const submitAnswer = () => {
    if (!currentChallenge) return;
    const val = parseFloat(answer);
    if (isNaN(val)) {
      setFeedback({ type: "error", message: "Veuillez entrer un nombre valide." });
      return;
    }

    const isCorrect =
      Math.abs(val - currentChallenge.expected_value) <= currentChallenge.tolerance;

    if (isCorrect) {
      setFeedback({
        type: "success",
        message: `✅ Correct ! ${currentChallenge.explanation ?? ""}`,
      });
      setSolved((prev) => new Set(prev).add(currentChallenge.id));

      // Move to next challenge
      const nextId = currentChallenge.next_on_correct ?? null;
      setTimeout(() => {
        if (nextId) {
          setCurrentChallengeId(nextId);
          setAnswer("");
          setFeedback(null);
        } else {
          setCurrentChallengeId("");
        }
      }, 1500);
    } else {
      const diff = val - currentChallenge.expected_value;
      setFeedback({
        type: "error",
        message: `❌ Incorrect. Votre réponse: ${val} ${currentChallenge.unit ?? ""}. ${
          diff > 0 ? "Trop élevé." : "Trop bas."
        } ${currentChallenge.hint ?? ""}`,
      });

      // Move to wrong branch if exists
      const nextId = currentChallenge.next_on_wrong ?? null;
      if (nextId && nextId !== currentChallenge.id) {
        setTimeout(() => {
          setCurrentChallengeId(nextId);
          setAnswer("");
          setFeedback(null);
        }, 2000);
      }
    }
  };

  return (
    <Card className="overflow-hidden border-purple-200">
      {/* Header — Numeria branded */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-[#1B2A4E] via-[#1B2A4E] to-[#2DD4BF]/20 px-5 py-3.5 border-b border-[#1B2A4E]/20">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2DD4BF]/15 ring-1 ring-[#2DD4BF]/30">
          <span className="text-base">🔬</span>
        </span>
        <span className="font-bold text-white text-base">{lab.title}</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[#C9A227]/15 px-2.5 py-0.5 text-xs font-semibold text-[#C9A227] ring-1 ring-[#C9A227]/30">
          {lab.points} pts
        </span>
      </div>

      {/* Instructions strip */}
      <div className="px-5 py-3 bg-muted/30 border-b text-xs text-muted-foreground italic">
        {lab.instructions}
      </div>

      <div className="grid md:grid-cols-2 gap-0">
        {/* LEFT: Simulation */}
        <div className="p-5 border-r border-border dark:border-gray-700">
          <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#1B2A4E] dark:text-[#2DD4BF] mb-3">
            📊 Simulation
          </h3>

          {/* Sliders */}
          <div className="space-y-4 mb-5">
            {sliders.map((slider) => (
              <div key={slider.name}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-foreground">
                    {slider.label}
                    {slider.unit ? ` (${slider.unit})` : ""}
                  </label>
                  <span className="text-xs font-mono font-bold text-[#2DD4BF] bg-[#2DD4BF]/10 px-2 py-0.5 rounded">
                    {sliderValues[slider.name].toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={sliderValues[slider.name]}
                  onChange={(e) =>
                    setSliderValues((prev) => ({
                      ...prev,
                      [slider.name]: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-[#2DD4BF]"
                />
              </div>
            ))}
          </div>

          {/* Run button */}
          <Button
            onClick={runSimulation}
            disabled={running}
            className="w-full bg-[#2DD4BF] text-[#1B2A4E] hover:bg-[#2DD4BF]/80 font-semibold"
          >
            {running ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exécution...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Exécuter la simulation
              </>
            )}
          </Button>

          {/* Output */}
          <div className="mt-4 min-h-48 rounded-xl bg-muted/30 border border-border flex items-center justify-center overflow-hidden">
            {error ? (
              <div className="p-3 text-sm text-red-500 font-mono">{error}</div>
            ) : imageData ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={imageData} alt="Simulation" className="w-full h-auto" />
            ) : (
              <span className="text-sm text-muted-foreground italic">
                Cliquez « Exécuter » pour lancer la simulation
              </span>
            )}
          </div>
        </div>

        {/* RIGHT: Adaptive challenge */}
        <div className="p-5 bg-muted/10">
          <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#1B2A4E] dark:text-[#2DD4BF] mb-3">
            🎯 Challenge
          </h3>

          {allSolved || !currentChallenge ? (
            <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 p-4 text-sm text-green-700 dark:text-green-300 text-center">
              <div className="text-3xl mb-2">🎉</div>
              <p className="font-bold">Tous les challenges sont résolus !</p>
              <p className="text-xs mt-1 opacity-80">Lab terminé avec succès.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl bg-[#1B2A4E]/5 dark:bg-[#2DD4BF]/10 border-2 border-[#1B2A4E]/20 dark:border-[#2DD4BF]/30 p-4">
                <p className="text-sm text-foreground mb-3 leading-relaxed">
                  {currentChallenge.question}
                </p>

                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Votre réponse"
                    className="flex-1 border-[#1B2A4E]/30 focus:border-[#2DD4BF]"
                  />
                  <span className="text-xs font-mono text-muted-foreground">
                    {currentChallenge.unit ?? ""}
                  </span>
                </div>

                <Button
                  onClick={submitAnswer}
                  className="mt-3 bg-[#1B2A4E] hover:bg-[#1B2A4E]/90 text-white w-full"
                  size="sm"
                >
                  Valider ma réponse
                </Button>

                {currentChallenge.hint && (
                  <details className="mt-3">
                    <summary className="text-xs text-[#C9A227] cursor-pointer font-medium hover:underline">
                      💡 Besoin d'un indice ?
                    </summary>
                    <p className="mt-1.5 text-xs text-muted-foreground italic bg-muted/50 p-2 rounded">
                      {currentChallenge.hint}
                    </p>
                  </details>
                )}
              </div>

              {/* Feedback */}
              {feedback && (
                <div
                  className={`rounded-xl px-4 py-3 text-sm ${
                    feedback.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {feedback.message}
                </div>
              )}

              {/* Progress */}
              <div className="text-xs text-muted-foreground">
                {solved.size} / {challenges.length} challenges résolus
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
