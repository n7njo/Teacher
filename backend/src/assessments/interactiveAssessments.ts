// Claude Flow Interactive Assessment System
// Comprehensive assessment and interactive element management

import {
  Assessment,
  InteractiveElement,
  AssessmentCriterion,
  Rubric,
  TestCase,
} from "../types/curriculum";

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
  timeLimit?: number; // seconds
  passingScore: number; // percentage
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
  timeLimit?: number; // minutes
}

// Assessment templates for different types
export const assessmentTemplates = {
  formativeQuiz: {
    id: "formative-quiz-template",
    type: "formative" as const,
    title: "Quick Knowledge Check",
    description: "Brief assessment to check understanding of key concepts",
    criteria: [
      {
        id: "concept-understanding",
        name: "Concept Understanding",
        description: "Demonstrates understanding of core concepts",
        weight: 70,
        levels: [
          {
            score: 4,
            label: "Excellent",
            description: "Complete understanding with clear explanations",
          },
          {
            score: 3,
            label: "Good",
            description: "Good understanding with minor gaps",
          },
          {
            score: 2,
            label: "Satisfactory",
            description: "Basic understanding but needs reinforcement",
          },
          {
            score: 1,
            label: "Needs Improvement",
            description: "Limited understanding, requires review",
          },
        ],
      },
      {
        id: "application",
        name: "Application",
        description: "Applies concepts to solve problems",
        weight: 30,
        levels: [
          {
            score: 4,
            label: "Excellent",
            description: "Applies concepts effectively in various contexts",
          },
          {
            score: 3,
            label: "Good",
            description: "Applies concepts with minimal guidance",
          },
          {
            score: 2,
            label: "Satisfactory",
            description: "Applies concepts with some assistance",
          },
          {
            score: 1,
            label: "Needs Improvement",
            description: "Struggles to apply concepts independently",
          },
        ],
      },
    ],
    autoGraded: true,
    passingScore: 70,
    attempts: 3,
  },

  codingChallenge: {
    id: "coding-challenge-template",
    type: "summative" as const,
    title: "Coding Challenge Assessment",
    description: "Practical coding assessment to evaluate programming skills",
    criteria: [
      {
        id: "correctness",
        name: "Correctness",
        description: "Solution produces correct output for all test cases",
        weight: 40,
        levels: [
          {
            score: 4,
            label: "Perfect",
            description: "All test cases pass, handles edge cases",
          },
          {
            score: 3,
            label: "Good",
            description: "Most test cases pass, minor issues",
          },
          {
            score: 2,
            label: "Partial",
            description: "Some test cases pass, basic functionality works",
          },
          {
            score: 1,
            label: "Incomplete",
            description: "Few test cases pass, major issues",
          },
        ],
      },
      {
        id: "code-quality",
        name: "Code Quality",
        description:
          "Code is well-structured, readable, and follows best practices",
        weight: 30,
        levels: [
          {
            score: 4,
            label: "Excellent",
            description: "Clean, well-documented, follows conventions",
          },
          {
            score: 3,
            label: "Good",
            description: "Generally clean with good structure",
          },
          {
            score: 2,
            label: "Acceptable",
            description: "Adequate structure, some improvements needed",
          },
          {
            score: 1,
            label: "Poor",
            description: "Difficult to read, poor structure",
          },
        ],
      },
      {
        id: "efficiency",
        name: "Efficiency",
        description: "Solution is optimized for time and space complexity",
        weight: 20,
        levels: [
          {
            score: 4,
            label: "Optimal",
            description: "Excellent time and space complexity",
          },
          {
            score: 3,
            label: "Good",
            description: "Good complexity, minor optimizations possible",
          },
          {
            score: 2,
            label: "Acceptable",
            description: "Reasonable complexity for the problem",
          },
          {
            score: 1,
            label: "Inefficient",
            description: "Poor complexity, needs optimization",
          },
        ],
      },
      {
        id: "problem-solving",
        name: "Problem Solving",
        description:
          "Demonstrates logical thinking and problem-solving approach",
        weight: 10,
        levels: [
          {
            score: 4,
            label: "Excellent",
            description: "Clear logic, innovative approach",
          },
          {
            score: 3,
            label: "Good",
            description: "Sound logic, systematic approach",
          },
          {
            score: 2,
            label: "Adequate",
            description: "Basic problem-solving evident",
          },
          {
            score: 1,
            label: "Weak",
            description: "Unclear logic, random attempts",
          },
        ],
      },
    ],
    autoGraded: false,
    passingScore: 75,
    attempts: 2,
  },

  projectAssessment: {
    id: "project-assessment-template",
    type: "summative" as const,
    title: "Project-Based Assessment",
    description:
      "Comprehensive evaluation of a complete project or application",
    criteria: [
      {
        id: "functionality",
        name: "Functionality",
        description:
          "Project meets all specified requirements and functions correctly",
        weight: 25,
        levels: [
          {
            score: 4,
            label: "Complete",
            description: "All requirements met, works flawlessly",
          },
          {
            score: 3,
            label: "Mostly Complete",
            description: "Most requirements met, minor issues",
          },
          {
            score: 2,
            label: "Partial",
            description: "Some requirements met, core functionality works",
          },
          {
            score: 1,
            label: "Incomplete",
            description: "Few requirements met, major functionality missing",
          },
        ],
      },
      {
        id: "design-architecture",
        name: "Design & Architecture",
        description:
          "System design is well-planned and follows good architectural principles",
        weight: 20,
        levels: [
          {
            score: 4,
            label: "Excellent",
            description:
              "Well-designed architecture, clear separation of concerns",
          },
          {
            score: 3,
            label: "Good",
            description: "Good design choices, mostly well-structured",
          },
          {
            score: 2,
            label: "Adequate",
            description: "Basic structure, some design improvements needed",
          },
          {
            score: 1,
            label: "Poor",
            description: "Poor structure, lacks clear design principles",
          },
        ],
      },
      {
        id: "code-quality-project",
        name: "Code Quality",
        description:
          "Code is maintainable, documented, and follows best practices",
        weight: 20,
        levels: [
          {
            score: 4,
            label: "Excellent",
            description: "Exemplary code quality, comprehensive documentation",
          },
          {
            score: 3,
            label: "Good",
            description: "Good code quality, adequate documentation",
          },
          {
            score: 2,
            label: "Acceptable",
            description: "Reasonable quality, basic documentation",
          },
          {
            score: 1,
            label: "Poor",
            description: "Poor quality, lacking documentation",
          },
        ],
      },
      {
        id: "user-experience",
        name: "User Experience",
        description: "Interface is intuitive, responsive, and user-friendly",
        weight: 15,
        levels: [
          {
            score: 4,
            label: "Outstanding",
            description: "Exceptional UX, highly intuitive and polished",
          },
          {
            score: 3,
            label: "Good",
            description: "Good UX, easy to use with minor improvements",
          },
          {
            score: 2,
            label: "Adequate",
            description: "Basic UX, functional but could be improved",
          },
          {
            score: 1,
            label: "Poor",
            description: "Poor UX, difficult to use or confusing",
          },
        ],
      },
      {
        id: "innovation-creativity",
        name: "Innovation & Creativity",
        description:
          "Project demonstrates creative problem-solving and innovative features",
        weight: 10,
        levels: [
          {
            score: 4,
            label: "Highly Creative",
            description: "Innovative solutions, creative features",
          },
          {
            score: 3,
            label: "Creative",
            description: "Some creative elements, good problem-solving",
          },
          {
            score: 2,
            label: "Standard",
            description: "Meets expectations, limited creativity",
          },
          {
            score: 1,
            label: "Basic",
            description: "Minimal creativity, standard implementation",
          },
        ],
      },
      {
        id: "testing-deployment",
        name: "Testing & Deployment",
        description:
          "Project includes appropriate testing and deployment considerations",
        weight: 10,
        levels: [
          {
            score: 4,
            label: "Comprehensive",
            description: "Thorough testing, production-ready deployment",
          },
          {
            score: 3,
            label: "Good",
            description: "Good test coverage, deployment strategy present",
          },
          {
            score: 2,
            label: "Basic",
            description: "Some testing, basic deployment consideration",
          },
          {
            score: 1,
            label: "Minimal",
            description: "Little to no testing or deployment planning",
          },
        ],
      },
    ],
    autoGraded: false,
    passingScore: 80,
    attempts: 1,
  },
};

// Interactive element templates
export const interactiveElements = {
  javaScriptCodeEditor: {
    id: "js-code-editor",
    type: "code_editor" as const,
    title: "JavaScript Code Editor",
    config: {
      language: "javascript",
      theme: "light",
      fontSize: 14,
      tabSize: 2,
      wordWrap: true,
      lineNumbers: true,
      minimap: false,
      autoComplete: true,
      syntaxHighlighting: true,
      errorChecking: true,
      readonly: false,
      testFramework: "jest",
    } as CodeEditorConfig,
    position: 1,
  },

  multipleChoiceQuiz: {
    id: "multiple-choice-quiz",
    type: "quiz" as const,
    title: "Knowledge Check Quiz",
    config: {
      questionType: "multiple_choice",
      randomizeOptions: true,
      showFeedback: "immediate",
      allowRetries: true,
      maxAttempts: 3,
      timeLimit: 300, // 5 minutes
      passingScore: 70,
    } as QuizConfig,
    position: 2,
  },

  algorithmVisualization: {
    id: "algorithm-visualization",
    type: "visualization" as const,
    title: "Algorithm Visualization",
    config: {
      type: "algorithm_visualization",
      interactive: true,
      speed: "variable",
      controls: ["play", "pause", "step", "reset", "speed"],
      dataSource: "user_input",
    } as SimulationConfig,
    position: 3,
  },

  reactSandbox: {
    id: "react-sandbox",
    type: "sandbox" as const,
    title: "React Development Sandbox",
    config: {
      environment: "react",
      preloadedPackages: ["react", "react-dom", "styled-components"],
      fileSystem: true,
      terminal: true,
      preview: true,
      collaboration: false,
    } as SandboxConfig,
    position: 4,
  },

  terminalEmulator: {
    id: "terminal-emulator",
    type: "terminal" as const,
    title: "Terminal Emulator",
    config: {
      shell: "bash",
      workingDirectory: "/home/student",
      allowFileSystem: true,
      allowNetworkAccess: false,
      preInstalledTools: ["git", "npm", "node", "python3"],
      timeLimit: 30,
    } as TerminalConfig,
    position: 5,
  },
};

// Assessment question banks
export const questionBanks = {
  javascriptFundamentals: [
    {
      id: "js-var-1",
      question:
        "What is the difference between `let` and `const` in JavaScript?",
      type: "multiple_choice",
      options: [
        "`let` is for strings, `const` is for numbers",
        "`let` allows reassignment, `const` creates immutable bindings",
        "`let` is function-scoped, `const` is block-scoped",
        "There is no difference",
      ],
      correctAnswer: 1,
      explanation:
        "`let` allows you to reassign the variable, while `const` creates a binding that cannot be reassigned (though the value itself may be mutable for objects and arrays).",
      difficulty: "beginner",
      tags: ["variables", "declarations", "scope"],
    },
    {
      id: "js-func-1",
      question: "Which of the following correctly defines an arrow function?",
      type: "multiple_choice",
      options: [
        '() -> { return "hello"; }',
        '() => { return "hello"; }',
        '() { return "hello"; }',
        'function() => { return "hello"; }',
      ],
      correctAnswer: 1,
      explanation:
        'Arrow functions use the `=>` syntax. The correct format is `() => { return "hello"; }` or `() => "hello"` for implicit returns.',
      difficulty: "beginner",
      tags: ["functions", "arrow-functions", "syntax"],
    },
    {
      id: "js-async-1",
      question: "What does the `await` keyword do in JavaScript?",
      type: "multiple_choice",
      options: [
        "It makes the function asynchronous",
        "It pauses execution until a Promise resolves",
        "It creates a new Promise",
        "It handles errors in asynchronous code",
      ],
      correctAnswer: 1,
      explanation:
        "The `await` keyword pauses the execution of an async function until the Promise resolves or rejects.",
      difficulty: "intermediate",
      tags: ["async", "promises", "await"],
    },
  ],

  dataStructures: [
    {
      id: "ds-array-1",
      question:
        "What is the time complexity of accessing an element by index in an array?",
      type: "multiple_choice",
      options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
      correctAnswer: 0,
      explanation:
        "Array access by index is O(1) because arrays store elements in contiguous memory locations, allowing direct access via index calculation.",
      difficulty: "intermediate",
      tags: ["arrays", "time-complexity", "big-o"],
    },
    {
      id: "ds-linkedlist-1",
      question: "What is the main advantage of a linked list over an array?",
      type: "multiple_choice",
      options: [
        "Faster access to elements",
        "Dynamic size allocation",
        "Better cache performance",
        "Lower memory usage",
      ],
      correctAnswer: 1,
      explanation:
        "Linked lists can grow and shrink dynamically during runtime, while arrays typically have a fixed size.",
      difficulty: "intermediate",
      tags: ["linked-lists", "arrays", "memory-management"],
    },
  ],
};

// Assessment management class
export class AssessmentManager {
  private assessments: Map<string, Assessment> = new Map();
  private responses: Map<string, any> = new Map();

  createAssessment(
    template: any,
    customizations: Partial<Assessment>,
  ): Assessment {
    const assessment: Assessment = {
      ...template,
      ...customizations,
      id: customizations.id || this.generateId(),
    };

    this.assessments.set(assessment.id, assessment);
    return assessment;
  }

  submitResponse(assessmentId: string, userId: string, responses: any): any {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) {
      throw new Error("Assessment not found");
    }

    const responseKey = `${assessmentId}-${userId}`;
    this.responses.set(responseKey, {
      assessmentId,
      userId,
      responses,
      submittedAt: new Date(),
      score: this.calculateScore(assessment, responses),
    });

    return this.responses.get(responseKey);
  }

  private calculateScore(assessment: Assessment, responses: any): number {
    if (!assessment.autoGraded) {
      return 0; // Manual grading required
    }

    // Simple scoring logic for auto-graded assessments
    // This would be expanded based on specific question types
    let totalQuestions = responses.length || 0;
    let correctAnswers = 0;

    responses.forEach((response: any, index: number) => {
      // This is a simplified scoring - real implementation would
      // check against correct answers from question bank
      if (response.isCorrect) {
        correctAnswers++;
      }
    });

    return totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  }

  getAssessmentResults(assessmentId: string, userId: string): any {
    const responseKey = `${assessmentId}-${userId}`;
    return this.responses.get(responseKey);
  }

  generateFeedback(assessment: Assessment, responses: any): string[] {
    const feedback: string[] = [];

    // Generate specific feedback based on responses
    // This is a simplified version - real implementation would be more sophisticated
    responses.forEach((response: any, index: number) => {
      if (!response.isCorrect) {
        feedback.push(
          `Question ${index + 1}: ${response.explanation || "Incorrect answer. Please review the material."}`,
        );
      }
    });

    if (feedback.length === 0) {
      feedback.push("Great job! All answers were correct.");
    }

    return feedback;
  }

  private generateId(): string {
    return "assessment-" + Math.random().toString(36).substr(2, 9);
  }
}

// Interactive element factory
export class InteractiveElementFactory {
  static createCodeEditor(
    config: Partial<CodeEditorConfig> = {},
  ): InteractiveElement {
    const defaultConfig = interactiveElements.javaScriptCodeEditor
      .config as CodeEditorConfig;
    return {
      ...interactiveElements.javaScriptCodeEditor,
      config: { ...defaultConfig, ...config },
    };
  }

  static createQuiz(config: Partial<QuizConfig> = {}): InteractiveElement {
    const defaultConfig = interactiveElements.multipleChoiceQuiz
      .config as QuizConfig;
    return {
      ...interactiveElements.multipleChoiceQuiz,
      config: { ...defaultConfig, ...config },
    };
  }

  static createVisualization(
    config: Partial<SimulationConfig> = {},
  ): InteractiveElement {
    const defaultConfig = interactiveElements.algorithmVisualization
      .config as SimulationConfig;
    return {
      ...interactiveElements.algorithmVisualization,
      config: { ...defaultConfig, ...config },
    };
  }

  static createSandbox(
    config: Partial<SandboxConfig> = {},
  ): InteractiveElement {
    const defaultConfig = interactiveElements.reactSandbox
      .config as SandboxConfig;
    return {
      ...interactiveElements.reactSandbox,
      config: { ...defaultConfig, ...config },
    };
  }

  static createTerminal(
    config: Partial<TerminalConfig> = {},
  ): InteractiveElement {
    const defaultConfig = interactiveElements.terminalEmulator
      .config as TerminalConfig;
    return {
      ...interactiveElements.terminalEmulator,
      config: { ...defaultConfig, ...config },
    };
  }
}
