/**
 * Type definitions for the course seeder.
 *
 * Each lesson has an ordered list of blocks, which can be:
 *  - text (markdown + LaTeX)
 *  - sandbox (Python code with matplotlib — rendered client-side via Pyodide)
 *  - mcq (multiple choice with feedback per choice)
 *  - lab (interactive sliders + matplotlib simulation)
 */

export type BlockInput =
  | { type: "text"; content: string }
  | {
      type: "sandbox";
      title: string;
      code: string;
    }
  | {
      type: "mcq";
      title: string;
      question: string;
      explanation: string;
      choices: { text: string; isCorrect: boolean; feedback: string }[];
    }
  | {
      type: "lab";
      title: string;
      instructions: string;
      simulationCode: string;
      sliderConfig: {
        name: string;
        label: string;
        min: number;
        max: number;
        step: number;
        default: number;
        unit?: string;
      }[];
      challenges: {
        id: string;
        question: string;
        expectedValue: number;
        tolerance: number;
        unit?: string;
        hint: string;
        explanation: string;
      }[];
    };

export type LessonInput = {
  title: string;
  slug: string;
  estimatedMinutes: number;
  isFreePreview: boolean;
  blocks: BlockInput[];
};

export type ModuleInput = {
  title: string;
  description?: string;
  lessons: LessonInput[];
};

export type CourseInput = {
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  level: "DEBUTANT" | "INTERMEDIAIRE" | "AVANCE";
  estimatedHours: number;
  modules: ModuleInput[];
};
