import {
  SkillProgression,
  SkillLevel,
  LearningPath,
} from "../types/curriculum";
export interface SkillMap {
  programming: ProgrammingSkills;
  webDevelopment: WebDevelopmentSkills;
  dataStructures: DataStructureSkills;
  algorithms: AlgorithmSkills;
  designPatterns: DesignPatternSkills;
  softwareEngineering: SoftwareEngineeringSkills;
}
export interface ProgrammingSkills {
  variables: SkillProgression;
  functions: SkillProgression;
  dataTypes: SkillProgression;
  controlFlow: SkillProgression;
  errorHandling: SkillProgression;
  asyncProgramming: SkillProgression;
}
export interface WebDevelopmentSkills {
  html: SkillProgression;
  css: SkillProgression;
  javascript: SkillProgression;
  react: SkillProgression;
  nodejs: SkillProgression;
  databases: SkillProgression;
}
export interface DataStructureSkills {
  arrays: SkillProgression;
  objects: SkillProgression;
  linkedLists: SkillProgression;
  stacks: SkillProgression;
  queues: SkillProgression;
  trees: SkillProgression;
  graphs: SkillProgression;
}
export interface AlgorithmSkills {
  searching: SkillProgression;
  sorting: SkillProgression;
  recursion: SkillProgression;
  dynamicProgramming: SkillProgression;
  graphAlgorithms: SkillProgression;
}
export interface DesignPatternSkills {
  creational: SkillProgression;
  structural: SkillProgression;
  behavioral: SkillProgression;
}
export interface SoftwareEngineeringSkills {
  testing: SkillProgression;
  debugging: SkillProgression;
  versionControl: SkillProgression;
  codeReview: SkillProgression;
  documentation: SkillProgression;
}
export declare const skillLevels: {
  variables: {
    skillName: string;
    levels: {
      level: number;
      name: string;
      description: string;
      requirements: string[];
      demonstrations: string[];
    }[];
    currentLevel: number;
    progress: number;
  };
  functions: {
    skillName: string;
    levels: {
      level: number;
      name: string;
      description: string;
      requirements: string[];
      demonstrations: string[];
    }[];
    currentLevel: number;
    progress: number;
  };
  asyncProgramming: {
    skillName: string;
    levels: {
      level: number;
      name: string;
      description: string;
      requirements: string[];
      demonstrations: string[];
    }[];
    currentLevel: number;
    progress: number;
  };
};
export declare const learningPaths: LearningPath[];
export declare class SkillProgressionManager {
  private userSkills;
  constructor();
  private initializeSkills;
  getSkillProgression(skillName: string): SkillProgression | undefined;
  updateSkillProgress(skillName: string, progress: number): void;
  getCurrentLevel(skillName: string): SkillLevel | undefined;
  getNextLevel(skillName: string): SkillLevel | undefined;
  isSkillCompleted(skillName: string): boolean;
  getRecommendedLearningPath(completedSkills: string[]): LearningPath[];
  calculateOverallProgress(): number;
  getSkillGaps(targetPath: LearningPath): string[];
  generatePersonalizedCurriculum(userGoals: string[]): LearningPath[];
}
//# sourceMappingURL=skillProgression.d.ts.map
