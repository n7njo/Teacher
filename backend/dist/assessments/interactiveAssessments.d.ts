import { Assessment, InteractiveElement } from "../types/curriculum";
export interface InteractiveElementConfig {
  codeEditor: CodeEditorConfig;
  quiz: QuizConfig;
  simulation: SimulationConfig;
  visualization: VisualizationConfig;
  sandbox: SandboxConfig;
  terminal: TerminalConfig;
}
export interface CodeEditorConfig {
  language: string;
  theme: "light" | "dark" | "high-contrast";
  fontSize: number;
  tabSize: number;
  wordWrap: boolean;
  lineNumbers: boolean;
  minimap: boolean;
  autoComplete: boolean;
  syntaxHighlighting: boolean;
  errorChecking: boolean;
  readonly: boolean;
  starterCode?: string;
  testFramework?: "jest" | "mocha" | "custom";
}
export interface QuizConfig {
  questionType:
    | "multiple_choice"
    | "true_false"
    | "fill_blank"
    | "matching"
    | "ordering";
  randomizeOptions: boolean;
  showFeedback: "immediate" | "after_submission" | "never";
  allowRetries: boolean;
  maxAttempts: number;
  timeLimit?: number;
  passingScore: number;
}
export interface SimulationConfig {
  type: "algorithm_visualization" | "data_structure" | "network" | "system";
  interactive: boolean;
  speed: "slow" | "normal" | "fast" | "variable";
  controls: string[];
  dataSource: "static" | "dynamic" | "user_input";
}
export interface VisualizationConfig {
  type: "chart" | "graph" | "tree" | "flowchart" | "sequence_diagram";
  interactive: boolean;
  zoom: boolean;
  pan: boolean;
  export: boolean;
  annotations: boolean;
}
export interface SandboxConfig {
  environment: "javascript" | "python" | "html_css" | "react" | "node";
  preloadedPackages: string[];
  fileSystem: boolean;
  terminal: boolean;
  preview: boolean;
  collaboration: boolean;
}
export interface TerminalConfig {
  shell: "bash" | "zsh" | "powershell" | "cmd";
  workingDirectory: string;
  allowFileSystem: boolean;
  allowNetworkAccess: boolean;
  preInstalledTools: string[];
  timeLimit?: number;
}
export declare const assessmentTemplates: {
  formativeQuiz: {
    id: string;
    type: "formative";
    title: string;
    description: string;
    criteria: {
      id: string;
      name: string;
      description: string;
      weight: number;
      levels: {
        score: number;
        label: string;
        description: string;
      }[];
    }[];
    autoGraded: boolean;
    passingScore: number;
    attempts: number;
  };
  codingChallenge: {
    id: string;
    type: "summative";
    title: string;
    description: string;
    criteria: {
      id: string;
      name: string;
      description: string;
      weight: number;
      levels: {
        score: number;
        label: string;
        description: string;
      }[];
    }[];
    autoGraded: boolean;
    passingScore: number;
    attempts: number;
  };
  projectAssessment: {
    id: string;
    type: "summative";
    title: string;
    description: string;
    criteria: {
      id: string;
      name: string;
      description: string;
      weight: number;
      levels: {
        score: number;
        label: string;
        description: string;
      }[];
    }[];
    autoGraded: boolean;
    passingScore: number;
    attempts: number;
  };
};
export declare const interactiveElements: {
  javaScriptCodeEditor: {
    id: string;
    type: "code_editor";
    title: string;
    config: CodeEditorConfig;
    position: number;
  };
  multipleChoiceQuiz: {
    id: string;
    type: "quiz";
    title: string;
    config: QuizConfig;
    position: number;
  };
  algorithmVisualization: {
    id: string;
    type: "visualization";
    title: string;
    config: SimulationConfig;
    position: number;
  };
  reactSandbox: {
    id: string;
    type: "sandbox";
    title: string;
    config: SandboxConfig;
    position: number;
  };
  terminalEmulator: {
    id: string;
    type: "terminal";
    title: string;
    config: TerminalConfig;
    position: number;
  };
};
export declare const questionBanks: {
  javascriptFundamentals: {
    id: string;
    question: string;
    type: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: string;
    tags: string[];
  }[];
  dataStructures: {
    id: string;
    question: string;
    type: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: string;
    tags: string[];
  }[];
};
export declare class AssessmentManager {
  private assessments;
  private responses;
  createAssessment(
    template: any,
    customizations: Partial<Assessment>,
  ): Assessment;
  submitResponse(assessmentId: string, userId: string, responses: any): any;
  private calculateScore;
  getAssessmentResults(assessmentId: string, userId: string): any;
  generateFeedback(assessment: Assessment, responses: any): string[];
  private generateId;
}
export declare class InteractiveElementFactory {
  static createCodeEditor(
    config?: Partial<CodeEditorConfig>,
  ): InteractiveElement;
  static createQuiz(config?: Partial<QuizConfig>): InteractiveElement;
  static createVisualization(
    config?: Partial<SimulationConfig>,
  ): InteractiveElement;
  static createSandbox(config?: Partial<SandboxConfig>): InteractiveElement;
  static createTerminal(config?: Partial<TerminalConfig>): InteractiveElement;
}
//# sourceMappingURL=interactiveAssessments.d.ts.map
