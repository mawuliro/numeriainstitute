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

    if (!(window as Record<string, unknown>).loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Pyodide"));
        document.head.appendChild(script);
      });
    }

    const py = await (window as Record<string, () => Promise<unknown>>).loadPyodide();
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
      const wrappedCode = `
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import json, io, base64

${lab.simulationCode}

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
      {/* Header */}
      <div className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-3.5 border-b">
        <span className="text-lg">🔬</span>
        <span className="font-bold text-white text-sm">{lab.title}</span>
        <span className="ml-auto text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
          {lab.points} pts
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-0">
        {/* LEFT: Simulation */}
        <div className="p-5 border-r dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">
            📊 Simulation
          </h3>

          {/* Sliders */}
          <div className="space-y-3 mb-4">
            {sliders.map((slider) => (
              <div key={slider.name}>
                <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">
                  {slider.label}
                  {slider.unit ? ` (${slider.unit})` : ""}
                </label>
                <div className="flex items-center gap-2">
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
                    className="flex-1 accent-purple-500"
                  />
                  <span className="text-xs font-mono text-gray-700 dark:text-gray-200 w-14 text-right">
                    {sliderValues[slider.name].toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Run button */}
          <Button
            onClick={runSimulation}
            disabled={running}
            className="w-full bg-[#1B2A4E] hover:bg-[#1B2A4E]/90"
          >
            {running ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Exécution...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Exécuter
              </>
            )}
          </Button>

          {/* Output */}
          <div className="mt-4 min-h-48 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            {error ? (
              <div className="p-3 text-sm text-red-500 font-mono">{error}</div>
            ) : imageData ? (
              <img src={imageData} alt="Simulation" className="w-full rounded-xl" />
            ) : (
              <span className="text-sm text-gray-400">
                Cliquez « Exécuter » pour lancer la simulation
              </span>
            )}
          </div>
        </div>

        {/* RIGHT: Adaptive challenge */}
        <div className="p-5">
          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 mb-3">
            🎯 Challenge
          </h3>

          {allSolved || !currentChallenge ? (
            <div className="rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 p-4 text-sm text-green-700 dark:text-green-300">
              🎉 Tous les challenges sont résolus ! Lab terminé.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 p-4">
                <p className="text-sm text-gray-800 dark:text-gray-100 mb-3">
                  {currentChallenge.question}
                </p>

                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Votre réponse"
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500">
                    {currentChallenge.unit ?? ""}
                  </span>
                </div>

                <Button
                  onClick={submitAnswer}
                  className="mt-3 bg-purple-500 hover:bg-purple-600"
                  size="sm"
                >
                  Valider
                </Button>

                {currentChallenge.hint && (
                  <details className="mt-2">
                    <summary className="text-xs text-amber-600 cursor-pointer">
                      💡 Indice
                    </summary>
                    <p className="mt-1 text-xs text-amber-700 dark:text-amber-400">
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
