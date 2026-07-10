"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type TrueFalseExercise = {
  id: string;
  title: string;
  statementsJson: string;
  explanation: string;
  points: number;
};

type Statement = {
  statement: string;
  is_true: boolean;
  statement_note?: string;
};

export function TrueFalseBlock({ exercise }: { exercise: TrueFalseExercise }) {
  const statements: Statement[] = JSON.parse(exercise.statementsJson || "[]");
  const [answers, setAnswers] = useState<Record<number, boolean | null>>({});
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = (idx: number, value: boolean) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [idx]: value }));
  };

  const submit = () => {
    setSubmitted(true);
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const allAnswered = statements.every((_, i) => answers[i] !== undefined);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center gap-2">
          <span className="text-base">✅</span>
          <span className="font-bold text-sm">{exercise.title}</span>
          <Badge variant="secondary" className="ml-auto">
            {exercise.points} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-3">
          {statements.map((stmt, idx) => {
            const userAnswer = answers[idx];
            const isCorrect = userAnswer === stmt.is_true;

            return (
              <div
                key={idx}
                className={`rounded-xl border p-4 transition-colors ${
                  submitted
                    ? isCorrect
                      ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                      : "border-red-300 bg-red-50 dark:bg-red-900/20"
                    : "border-border"
                }`}
              >
                <p className="text-sm font-medium mb-3">{stmt.statement}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAnswer(idx, true)}
                    disabled={submitted}
                    className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                      userAnswer === true
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    } ${submitted && stmt.is_true ? "ring-2 ring-green-500" : ""}`}
                  >
                    Vrai
                  </button>
                  <button
                    onClick={() => setAnswer(idx, false)}
                    disabled={submitted}
                    className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                      userAnswer === false
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    } ${submitted && !stmt.is_true ? "ring-2 ring-green-500" : ""}`}
                  >
                    Faux
                  </button>
                  {submitted && (
                    <span className="ml-auto text-sm">
                      {isCorrect ? "✅" : "❌"}
                    </span>
                  )}
                </div>
                {submitted && !isCorrect && stmt.statement_note && (
                  <p className="mt-2 text-xs text-muted-foreground italic">
                    {stmt.statement_note}
                  </p>
                )}
              </div>
            );
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
              disabled={!allAnswered}
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
