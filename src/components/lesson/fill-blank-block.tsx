"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FillBlankExercise = {
  id: string;
  title: string;
  textWithBlanks: string;
  answersJson: string;
  explanation: string;
  points: number;
};

export function FillBlankBlock({ exercise }: { exercise: FillBlankExercise }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const answersMap: Record<string, string[]> = JSON.parse(
    exercise.answersJson || "{}",
  );

  // Replace {{blank_X}} with input fields after rendering
  useEffect(() => {
    if (!containerRef.current) return;

    // Render MathJax on the text
    if (window.MathJax?.typesetPromise && containerRef.current) {
      // First, typeset the LaTeX (the {{blank_X}} are outside $...$)
      window.MathJax.typesetPromise([containerRef.current]).catch(() => {});
    }
  }, [exercise.textWithBlanks]);

  const submit = () => {
    const newResults: Record<string, boolean> = {};
    Object.keys(answersMap).forEach((blankId) => {
      const userAnswer = (answers[blankId] ?? "").trim().toLowerCase();
      const acceptable = answersMap[blankId].map((a) => a.trim().toLowerCase());
      newResults[blankId] = acceptable.includes(userAnswer);
    });
    setResults(newResults);
    setSubmitted(true);
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
    setResults({});
  };

  // Split text at {{blank_X}} markers
  const parts = exercise.textWithBlanks.split(/(\{\{blank_\w+\}\})/g);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center gap-2">
          <span className="text-base">✏️</span>
          <span className="font-bold text-sm">{exercise.title}</span>
          <Badge variant="secondary" className="ml-auto">
            {exercise.points} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div
          ref={containerRef}
          className="text-sm leading-relaxed text-gray-800 dark:text-gray-100"
        >
          {parts.map((part, i) => {
            const match = part.match(/^\{\{blank_(\w+)\}\}$/);
            if (match) {
              const blankId = `blank_${match[1]}`;
              const isCorrect = results[blankId];
              return (
                <Input
                  key={i}
                  type="text"
                  value={answers[blankId] ?? ""}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [blankId]: e.target.value }))
                  }
                  disabled={submitted}
                  className={`inline-block w-32 mx-1 ${
                    submitted
                      ? isCorrect
                        ? "border-green-500"
                        : "border-red-500"
                      : ""
                  }`}
                  placeholder="..."
                />
              );
            }
            // Render text part — may contain LaTeX
            return <span key={i}>{part}</span>;
          })}
        </div>

        {/* Explanation */}
        {submitted && exercise.explanation && (
          <div className="mt-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 p-3 text-sm text-blue-800 dark:text-blue-300">
            <strong>💡 Explication :</strong> {exercise.explanation}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {!submitted ? (
            <Button
              onClick={submit}
              size="sm"
              className="bg-[#1B2A4E] hover:bg-[#1B2A4E]/90"
            >
              Valider
            </Button>
          ) : (
            <Button onClick={reset} variant="outline" size="sm">
              ↩️ Réessayer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
