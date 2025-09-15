import { LessonContent } from "../types/curriculum";
export interface LessonTemplate {
  id: string;
  name: string;
  description: string;
  type:
    | "reading"
    | "video"
    | "interactive"
    | "quiz"
    | "exercise"
    | "hands_on"
    | "assessment"
    | "project";
  skillLevel: "beginner" | "intermediate" | "advanced" | "expert";
  estimatedDuration: number;
  structure: LessonStructure;
}
export interface LessonStructure {
  introduction: SectionTemplate;
  learningContent: SectionTemplate[];
  practiceActivities: SectionTemplate[];
  assessment: SectionTemplate;
  closure: SectionTemplate;
}
export interface SectionTemplate {
  id: string;
  title: string;
  type: "text" | "video" | "interactive" | "exercise" | "assessment";
  required: boolean;
  estimatedTime: number;
  contentGuidelines: string[];
  examples?: string[];
}
export declare const beginnerReadingTemplate: LessonTemplate;
export declare const handsOnCodingTemplate: LessonTemplate;
export declare const projectBasedTemplate: LessonTemplate;
export declare const assessmentTemplate: LessonTemplate;
export declare const lessonTemplates: {
  beginnerReading: LessonTemplate;
  handsOnCoding: LessonTemplate;
  projectBased: LessonTemplate;
  assessment: LessonTemplate;
};
export declare function applyLessonTemplate(
  template: LessonTemplate,
  customizations: Partial<LessonContent>,
): LessonContent;
//# sourceMappingURL=lessonTemplates.d.ts.map
