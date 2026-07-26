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
    <Card className="overflow-hidden border-[#1B2A4E]/20 shadow-md">
      <CardHeader className="bg-gradient-to-r from-[#1B2A4E] to-[#2DD4BF]/10 border-b border-[#1B2A4E]/20">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2DD4BF]/15 ring-1 ring-[#2DD4BF]/30">
            <span className="text-base">🎯</span>
          </span>
          <span className="font-bold text-sm text-white">{exercise.title}</span>
          <Badge className="ml-auto bg-[#C9A227]/20 text-[#C9A227] ring-1 ring-[#C9A227]/30 border-0">
            {exercise.points} pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="prose prose-sm max-w-none mb-5 rounded-lg bg-muted/30 p-4 border-l-2 border-[#1B2A4E]">
          <span dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(exercise.question.replace(/\\n/g, "\n")) }} />
        </div>

        <div className="space-y-2.5">
          {exercise.choices.map((choice, idx) => {
            const isSelected = selected.has(choice.id);
            const isCorrectChoice = choice.isCorrect;

            let bgClass = "bg-card border-border hover:border-[#2DD4BF]/40 hover:bg-[#2DD4BF]/5";
            if (submitted) {
              if (isCorrectChoice) {
                bgClass = "bg-green-50 dark:bg-green-900/20 border-green-400 dark:border-green-600";
              } else if (isSelected && !isCorrectChoice) {
                bgClass = "bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-600";
              }
            } else if (isSelected) {
              bgClass = "bg-[#1B2A4E]/5 border-[#1B2A4E] dark:bg-[#2DD4BF]/10 dark:border-[#2DD4BF]";
            }

            return (
              <label
                key={choice.id}
                className={`flex items-start gap-3 rounded-xl border-2 p-3.5 cursor-pointer transition-all ${bgClass} ${submitted ? "cursor-default" : "hover:shadow-sm"}`}
              >
                <input
                  type={exercise.allowMultiple ? "checkbox" : "radio"}
                  name={`mcq-${exercise.id}`}
                  checked={isSelected}
                  onChange={() => toggleChoice(choice.id)}
                  disabled={submitted}
                  className="mt-0.5 h-4 w-4 accent-[#2DD4BF]"
                />
                <span className="text-sm flex-1 leading-relaxed text-foreground">
                  <span className="text-xs font-mono text-muted-foreground mr-2">{String.fromCharCode(65 + idx)}.</span>
                  {choice.text}
                </span>
                {submitted && isCorrectChoice && (
                  <span className="text-green-600 dark:text-green-400 text-lg">✓</span>
                )}
                {submitted && isSelected && !isCorrectChoice && (
                  <span className="text-red-600 dark:text-red-400 text-lg">✗</span>
                )}
              </label>
            );
          })}
        </div>

        {/* Feedback */}
        {submitted && (
          <div
            className={`mt-5 rounded-xl p-4 text-sm border-2 ${
              isCorrect
                ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700"
                : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700"
            }`}
          >
            <p className="font-bold flex items-center gap-2">
              {isCorrect ? (
                <><span className="text-lg">🎉</span> Bonne réponse ! +{exercise.points} pts</>
              ) : (
                <><span className="text-lg">💭</span> Ce n'est pas la bonne réponse.</>
              )}
            </p>
            {submitted &&
              exercise.choices
                .filter((c) => selected.has(c.id) && c.feedback)
                .map((c) => (
                  <p key={c.id} className="mt-2 text-xs leading-relaxed opacity-90">
                    {c.feedback}
                  </p>
                ))}
          </div>
        )}

        {/* Explanation */}
        {showExplanation && exercise.explanation && (
          <div className="mt-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 p-4 text-sm text-blue-800 dark:text-blue-300">
            <strong className="flex items-center gap-1.5 mb-1">
              <span>💡</span> Explication
            </strong>
            <span
              className="leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: renderSimpleMarkdown(exercise.explanation),
              }}
            />
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex gap-2">
          {!submitted ? (
            <Button
              onClick={submit}
              disabled={selected.size === 0}
              size="sm"
              className="bg-[#2DD4BF] text-[#1B2A4E] hover:bg-[#2DD4BF]/80 font-semibold"
            >
              ✓ Valider ma réponse
            </Button>
          ) : (
            <Button onClick={reset} variant="outline" size="sm" className="border-[#1B2A4E]/30 text-[#1B2A4E] hover:bg-[#1B2A4E]/5">
              ↻ Réessayer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function renderSimpleMarkdown(text: string): string {
  // SECURITY: escape HTML first to prevent XSS
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Inline math: $...$ — kept as text so MathJax picks it up
  html = html.replace(/\$([^$]+)\$/g, "<span class='math-inline'>$$$1$$</span>");
  return html;
}
