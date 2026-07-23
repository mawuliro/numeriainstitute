import type { LessonBlock, MCQExercise, FillBlankExercise, TrueFalseExercise, CodeExercise, InteractiveLab } from "@prisma/client";
import { TextBlock } from "./text-block";
import { SandboxBlock } from "./sandbox-block";
import { McqBlock } from "./mcq-block";
import { FillBlankBlock } from "./fill-blank-block";
import { TrueFalseBlock } from "./true-false-block";
import { LabBlock } from "./lab-block";

type Choice = {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  order: number;
};

type BlockWithRelations = LessonBlock & {
  mcq: (MCQExercise & { choices: Choice[] }) | null;
  fillBlank: FillBlankExercise | null;
  trueFalse: TrueFalseExercise | null;
  codeEx: CodeExercise | null;
  lab: InteractiveLab | null;
};

export function LessonBlocksRenderer({ blocks }: { blocks: BlockWithRelations[] }) {
  if (!blocks || blocks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Le contenu de cette leçon sera bientôt disponible.
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {blocks.map((block) => {
        switch (block.blockType) {
          case "TEXT":
            return <TextBlock key={block.id} content={block.textContent ?? ""} />;
          case "SANDBOX":
            return (
              <SandboxBlock
                key={block.id}
                title={block.sandboxTitle ?? "Simulation"}
                code={block.sandboxInitialCode ?? ""}
              />
            );
          case "MCQ":
            if (!block.mcq) return null;
            return <McqBlock key={block.id} exercise={block.mcq} />;
          case "FILL_BLANK":
            if (!block.fillBlank) return null;
            return <FillBlankBlock key={block.id} exercise={block.fillBlank} />;
          case "TRUE_FALSE":
            if (!block.trueFalse) return null;
            return <TrueFalseBlock key={block.id} exercise={block.trueFalse} />;
          case "INTERACTIVE_LAB":
            if (!block.lab) return null;
            return <LabBlock key={block.id} lab={block.lab} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
