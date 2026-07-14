"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Choice = {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  order: number;
};

type MCQExercise = {
  id: string;
  title: string;
  question: string;
  choices: Choice[];
  explanation: string;
  points: number;
  allowMultiple: boolean;
};

export function McqBlock({ exercise }: { exercise: MCQExercise }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const toggleChoice = (choiceId: string) => {
    if (submitted) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (exercise.allowMultiple) {
        if (next.has(choiceId)) {
          next.delete(choiceId);
        } else {
          next.add(choiceId);
        }
      } else {
        next.clear();
        next.add(choiceId);
      }
      return next;
    });
  };

  const submit = () => {
    setSubmitted(true);
    // Check if all correct answers are selected and no incorrect ones
    const correctIds = new Set(
      exercise.choices.filter((c) => c.isCorrect).map((c) => c.id),
    );
    const isCorrect =
      selected.size === correctIds.size &&
      [...selected].every((id) => correctIds.has(id));

    if (isCorrect || exercise.explanation) {
      setShowExplanation(true);
    }
  };

  const reset = () => {
    setSelected(new Set());
    setSubmitted(false);
    setShowExplanation(false);
  };

  const correctIds = new Set(
    exercise.choices.filter((c) => c.isCorrect).map((c) => c.id),
  );
  const isCorrect =
    submitted &&
    selected.size === correctIds.size &&
    [...selected].every((id) => correctIds.has(id));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center gap-2">
          <span className="text-base">🔘</span>
          <span className="font-bold text-sm">{exercise.title}</span>
          <Badge variant="secondary" className="ml-auto">
            {exercise.points} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div
          className="prose prose-sm max-w-none mb-4"
          dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(exercise.question.replace(/\\n/g, "\n")) }}
        />

        <div className="space-y-2">
          {exercise.choices.map((choice) => {
            const isSelected = selected.has(choice.id);
            const isCorrectChoice = choice.isCorrect;

            let bgClass = "bg-muted/30 border-border hover:border-primary/30";
            if (submitted) {
              if (isCorrectChoice) {
                bgClass = "bg-green-50 dark:bg-green-900/20 border-green-400";
              } else if (isSelected && !isCorrectChoice) {
                bgClass = "bg-red-50 dark:bg-red-900/20 border-red-400";
              }
            } else if (isSelected) {
              bgClass = "bg-primary/5 border-primary";
            }

            return (
              <label
                key={choice.id}
                className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${bgClass} ${submitted ? "cursor-default" : ""}`}
                onClick={() => toggleChoice(choice.id)}
              >
                <input
                  type={exercise.allowMultiple ? "checkbox" : "radio"}
                  name={`mcq-${exercise.id}`}
                  checked={isSelected}
                  onChange={() => {}}
                  disabled={submitted}
                  className="mt-0.5 accent-[#1B2A4E]"
                />
                <span className="text-sm flex-1">{choice.text}</span>
                {submitted && isCorrectChoice && (
                  <span className="text-green-600">✅</span>
                )}
                {submitted && isSelected && !isCorrectChoice && (
                  <span className="text-red-600">❌</span>
                )}
              </label>
            );
          })}
        </div>

        {/* Feedback */}
        {submitted && (
          <div
            className={`mt-4 rounded-xl p-4 text-sm ${
              isCorrect
                ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200"
                : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200"
            }`}
          >
            <p className="font-bold">
              {isCorrect
                ? `✅ Bonne réponse ! +${exercise.points} pts`
                : "❌ Ce n'est pas la bonne réponse."}
            </p>
            {submitted &&
              exercise.choices
                .filter((c) => selected.has(c.id) && c.feedback)
                .map((c) => (
                  <p key={c.id} className="mt-1 text-xs">
                    {c.feedback}
                  </p>
                ))}
          </div>
        )}

        {/* Explanation */}
        {showExplanation && exercise.explanation && (
          <div className="mt-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 p-4 text-sm text-blue-800 dark:text-blue-300">
            <strong>💡 Explication :</strong>{" "}
            <span
              dangerouslySetInnerHTML={{
                __html: renderSimpleMarkdown(exercise.explanation),
              }}
            />
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {!submitted ? (
            <Button
              onClick={submit}
              disabled={selected.size === 0}
              size="sm"
              className="bg-[#1B2A4E] hover:bg-[#1B2A4E]/90"
            >
              ✅ Valider ma réponse
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

function renderSimpleMarkdown(text: string): string {
  let html = text;
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\$([^$]+)\$/g, "<span class='math-inline'>$$$1$$</span>");
  return html;
}
