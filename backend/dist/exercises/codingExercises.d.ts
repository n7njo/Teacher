import { Exercise } from "../types/curriculum";
export interface ExerciseLibrary {
  beginner: Exercise[];
  intermediate: Exercise[];
  advanced: Exercise[];
  expert: Exercise[];
}
export interface ExerciseCategory {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
}
export declare const beginnerExercises: Exercise[];
export declare const intermediateExercises: Exercise[];
export declare const advancedExercises: Exercise[];
export declare const expertExercises: Exercise[];
export declare const exerciseCategories: ExerciseCategory[];
export declare const exerciseLibrary: ExerciseLibrary;
export declare function getExercisesByDifficulty(
  difficulty: string,
): Exercise[];
export declare function getExercisesByCategory(categoryId: string): Exercise[];
export declare function getExerciseById(
  exerciseId: string,
): Exercise | undefined;
//# sourceMappingURL=codingExercises.d.ts.map
