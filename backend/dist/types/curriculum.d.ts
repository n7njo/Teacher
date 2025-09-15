export interface LearningObjective {
  id: string;
  description: string;
  bloomLevel:
    | "remember"
    | "understand"
    | "apply"
    | "analyze"
    | "evaluate"
    | "create";
  assessable: boolean;
}
export interface CodeExample {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  difficulty: "basic" | "intermediate" | "advanced";
  explanation: string;
  expectedOutput?: string;
  interactive: boolean;
}
export interface Exercise {
  id: string;
  title: string;
  description: string;
  type:
    | "coding"
    | "multiple_choice"
    | "fill_blank"
    | "drag_drop"
    | "project"
    | "discussion";
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  instructions: string[];
  starterCode?: string;
  solution?: string;
  hints?: string[];
  testCases?: TestCase[];
  timeEstimate: number;
  points: number;
}
export interface TestCase {
  id: string;
  input: any;
  expectedOutput: any;
  description: string;
  hidden: boolean;
}
export interface Assessment {
  id: string;
  type: "formative" | "summative" | "diagnostic" | "peer_review";
  title: string;
  description: string;
  criteria: AssessmentCriterion[];
  rubric?: Rubric;
  autoGraded: boolean;
  passingScore: number;
  attempts: number;
}
export interface AssessmentCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  levels: CriterionLevel[];
}
export interface CriterionLevel {
  score: number;
  label: string;
  description: string;
}
export interface Rubric {
  id: string;
  name: string;
  description: string;
  criteria: AssessmentCriterion[];
  totalPoints: number;
}
export interface Resource {
  id: string;
  title: string;
  type:
    | "documentation"
    | "video"
    | "article"
    | "book"
    | "tool"
    | "library"
    | "repository";
  url?: string;
  description: string;
  required: boolean;
  estimatedTime?: number;
}
export interface LearningPath {
  id: string;
  name: string;
  description: string;
  prerequisites: string[];
  lessons: string[];
  estimatedDuration: number;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  outcomes: LearningObjective[];
}
export interface SkillProgression {
  skillName: string;
  levels: SkillLevel[];
  currentLevel: number;
  progress: number;
}
export interface SkillLevel {
  level: number;
  name: string;
  description: string;
  requirements: string[];
  demonstrations: string[];
}
export interface InteractiveElement {
  id: string;
  type:
    | "code_editor"
    | "quiz"
    | "simulation"
    | "visualization"
    | "sandbox"
    | "terminal";
  title: string;
  config: Record<string, any>;
  position: number;
}
export interface LessonContent {
  version: string;
  sections: ContentSection[];
  interactiveElements: InteractiveElement[];
  codeExamples: CodeExample[];
  exercises: Exercise[];
  assessments: Assessment[];
  resources: Resource[];
  metadata: ContentMetadata;
}
export interface ContentSection {
  id: string;
  title: string;
  type: "text" | "markdown" | "video" | "audio" | "image" | "interactive";
  content: string;
  order: number;
  timeEstimate: number;
}
export interface ContentMetadata {
  author: string;
  lastModified: Date;
  reviewedBy?: string;
  reviewDate?: Date;
  version: string;
  keywords: string[];
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  estimatedTime: number;
}
export interface EnhancedLesson {
  id: string;
  topicId: string;
  name: string;
  description: string;
  slug: string;
  content: LessonContent;
  orderIndex: number;
  estimatedDurationMinutes: number;
  lessonType:
    | "reading"
    | "video"
    | "interactive"
    | "quiz"
    | "exercise"
    | "hands_on"
    | "assessment"
    | "project";
  skillLevel: "beginner" | "intermediate" | "advanced" | "expert";
  prerequisites: string[];
  learningObjectives: LearningObjective[];
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
export interface DetailedProgress {
  lessonId: string;
  userId: string;
  status:
    | "not_started"
    | "in_progress"
    | "completed"
    | "skipped"
    | "needs_review";
  completionPercentage: number;
  timeSpentMinutes: number;
  exercisesCompleted: number;
  exercisesTotal: number;
  assessmentScores: Record<string, number>;
  skillsAcquired: string[];
  lastAccessedAt: Date;
  completedAt?: Date;
  notes?: string;
}
export interface LearningAnalytics {
  userId: string;
  totalLessonsCompleted: number;
  totalTimeSpent: number;
  averageScore: number;
  skillsAcquired: SkillProgression[];
  learningPaths: LearningPath[];
  strengths: string[];
  areasForImprovement: string[];
  recommendedNextLessons: string[];
}
//# sourceMappingURL=curriculum.d.ts.map
