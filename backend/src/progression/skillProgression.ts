// Claude Flow Skill Progression System
// Structured learning paths and skill level management

import {
  SkillProgression,
  SkillLevel,
  LearningPath,
  LearningObjective,
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

// Skill level definitions
export const skillLevels = {
  variables: {
    skillName: "Variables and Data Types",
    levels: [
      {
        level: 1,
        name: "Novice",
        description: "Understanding basic variable concepts",
        requirements: [
          "Understand what variables are",
          "Know basic data types (string, number, boolean)",
          "Can declare variables with let/const",
        ],
        demonstrations: [
          "Declare variables with appropriate names",
          "Assign values to variables",
          "Use variables in simple expressions",
        ],
      },
      {
        level: 2,
        name: "Beginner",
        description: "Working with different data types effectively",
        requirements: [
          "Understand variable scope (global vs local)",
          "Know when to use let vs const",
          "Understand type coercion basics",
        ],
        demonstrations: [
          "Use variables in different scopes correctly",
          "Choose appropriate data types for different scenarios",
          "Avoid common variable declaration mistakes",
        ],
      },
      {
        level: 3,
        name: "Intermediate",
        description: "Advanced variable and type manipulation",
        requirements: [
          "Understand hoisting and temporal dead zone",
          "Know complex data types (arrays, objects)",
          "Understand reference vs primitive types",
        ],
        demonstrations: [
          "Manipulate complex data structures",
          "Understand variable lifecycle",
          "Debug variable-related issues",
        ],
      },
      {
        level: 4,
        name: "Advanced",
        description: "Mastery of variable patterns and best practices",
        requirements: [
          "Understand closure and lexical scoping",
          "Know destructuring and spread operators",
          "Understand immutability concepts",
        ],
        demonstrations: [
          "Use advanced destructuring patterns",
          "Implement immutable data patterns",
          "Optimize variable usage for performance",
        ],
      },
    ],
    currentLevel: 0,
    progress: 0,
  },

  functions: {
    skillName: "Functions and Functional Programming",
    levels: [
      {
        level: 1,
        name: "Novice",
        description: "Basic function creation and usage",
        requirements: [
          "Understand what functions are and why they are useful",
          "Can create simple functions with parameters",
          "Understand return statements",
        ],
        demonstrations: [
          "Write functions that take parameters and return values",
          "Call functions with appropriate arguments",
          "Use functions to avoid code repetition",
        ],
      },
      {
        level: 2,
        name: "Beginner",
        description: "Function expressions and arrow functions",
        requirements: [
          "Understand function declarations vs expressions",
          "Know arrow function syntax",
          "Understand function scope and this binding",
        ],
        demonstrations: [
          "Use arrow functions appropriately",
          "Understand when this binding matters",
          "Use functions as values and pass them as arguments",
        ],
      },
      {
        level: 3,
        name: "Intermediate",
        description: "Higher-order functions and callbacks",
        requirements: [
          "Understand callbacks and higher-order functions",
          "Know array methods (map, filter, reduce)",
          "Understand asynchronous functions",
        ],
        demonstrations: [
          "Use array methods effectively",
          "Create and use callback functions",
          "Handle asynchronous operations with functions",
        ],
      },
      {
        level: 4,
        name: "Advanced",
        description: "Functional programming patterns",
        requirements: [
          "Understand closures and currying",
          "Know pure functions and side effects",
          "Understand function composition",
        ],
        demonstrations: [
          "Implement curried functions",
          "Use function composition patterns",
          "Design pure, testable functions",
        ],
      },
    ],
    currentLevel: 0,
    progress: 0,
  },

  asyncProgramming: {
    skillName: "Asynchronous Programming",
    levels: [
      {
        level: 1,
        name: "Novice",
        description: "Understanding asynchronous concepts",
        requirements: [
          "Understand what asynchronous programming is",
          "Know the difference between sync and async operations",
          "Understand callbacks basics",
        ],
        demonstrations: [
          "Use setTimeout and setInterval",
          "Write simple callback functions",
          "Understand when operations are asynchronous",
        ],
      },
      {
        level: 2,
        name: "Beginner",
        description: "Working with Promises",
        requirements: [
          "Understand Promise concepts",
          "Know how to create and consume Promises",
          "Understand Promise states (pending, fulfilled, rejected)",
        ],
        demonstrations: [
          "Create Promises with resolve and reject",
          "Use .then() and .catch() methods",
          "Chain multiple Promises together",
        ],
      },
      {
        level: 3,
        name: "Intermediate",
        description: "Async/await and error handling",
        requirements: [
          "Master async/await syntax",
          "Understand error handling in async code",
          "Know Promise.all, Promise.race utilities",
        ],
        demonstrations: [
          "Use async/await for clean asynchronous code",
          "Implement proper error handling with try/catch",
          "Use Promise utilities for concurrent operations",
        ],
      },
      {
        level: 4,
        name: "Advanced",
        description: "Advanced async patterns",
        requirements: [
          "Understand event loops and microtasks",
          "Know async iterators and generators",
          "Understand performance implications of async code",
        ],
        demonstrations: [
          "Implement async iterators",
          "Optimize async code for performance",
          "Debug complex asynchronous issues",
        ],
      },
    ],
    currentLevel: 0,
    progress: 0,
  },
};

// Learning paths that connect skills
export const learningPaths: LearningPath[] = [
  {
    id: "javascript-fundamentals",
    name: "JavaScript Fundamentals",
    description: "Master the core concepts of JavaScript programming",
    prerequisites: [],
    lessons: [
      "variables-and-data-types",
      "operators-and-expressions",
      "control-structures",
      "functions-basics",
      "arrays-and-objects",
      "scope-and-closures",
    ],
    estimatedDuration: 480, // 8 hours
    difficulty: "beginner",
    outcomes: [
      {
        id: "js-vars",
        description: "Declare and use variables effectively",
        bloomLevel: "apply",
        assessable: true,
      },
      {
        id: "js-functions",
        description:
          "Create and use functions with parameters and return values",
        bloomLevel: "apply",
        assessable: true,
      },
      {
        id: "js-control",
        description: "Use control structures for program flow",
        bloomLevel: "apply",
        assessable: true,
      },
    ],
  },

  {
    id: "async-programming-mastery",
    name: "Asynchronous Programming Mastery",
    description: "Learn to handle asynchronous operations effectively",
    prerequisites: ["javascript-fundamentals"],
    lessons: [
      "intro-to-async",
      "callbacks-and-higher-order-functions",
      "promises-fundamentals",
      "async-await-patterns",
      "error-handling-async",
      "promise-utilities",
      "async-patterns-advanced",
    ],
    estimatedDuration: 360, // 6 hours
    difficulty: "intermediate",
    outcomes: [
      {
        id: "async-promises",
        description: "Use Promises to handle asynchronous operations",
        bloomLevel: "apply",
        assessable: true,
      },
      {
        id: "async-await",
        description: "Write clean asynchronous code with async/await",
        bloomLevel: "apply",
        assessable: true,
      },
      {
        id: "async-error-handling",
        description: "Implement proper error handling in asynchronous code",
        bloomLevel: "analyze",
        assessable: true,
      },
    ],
  },

  {
    id: "data-structures-fundamentals",
    name: "Data Structures Fundamentals",
    description: "Understanding and implementing essential data structures",
    prerequisites: ["javascript-fundamentals"],
    lessons: [
      "arrays-deep-dive",
      "objects-and-maps",
      "linked-lists-implementation",
      "stacks-and-queues",
      "trees-introduction",
      "hash-tables-basics",
    ],
    estimatedDuration: 540, // 9 hours
    difficulty: "intermediate",
    outcomes: [
      {
        id: "ds-arrays",
        description: "Implement and use arrays effectively",
        bloomLevel: "apply",
        assessable: true,
      },
      {
        id: "ds-linked-lists",
        description: "Implement linked list data structures",
        bloomLevel: "create",
        assessable: true,
      },
      {
        id: "ds-stacks-queues",
        description: "Implement and use stacks and queues",
        bloomLevel: "create",
        assessable: true,
      },
    ],
  },

  {
    id: "algorithms-fundamentals",
    name: "Algorithms Fundamentals",
    description: "Learn essential algorithms and problem-solving techniques",
    prerequisites: ["data-structures-fundamentals"],
    lessons: [
      "algorithm-complexity",
      "searching-algorithms",
      "sorting-algorithms",
      "recursion-fundamentals",
      "divide-and-conquer",
      "dynamic-programming-intro",
    ],
    estimatedDuration: 600, // 10 hours
    difficulty: "advanced",
    outcomes: [
      {
        id: "algo-searching",
        description: "Implement and analyze searching algorithms",
        bloomLevel: "analyze",
        assessable: true,
      },
      {
        id: "algo-sorting",
        description: "Implement various sorting algorithms",
        bloomLevel: "create",
        assessable: true,
      },
      {
        id: "algo-recursion",
        description: "Use recursion to solve complex problems",
        bloomLevel: "analyze",
        assessable: true,
      },
    ],
  },

  {
    id: "web-development-full-stack",
    name: "Full-Stack Web Development",
    description: "Complete web development skills from frontend to backend",
    prerequisites: ["javascript-fundamentals", "async-programming-mastery"],
    lessons: [
      "html-semantics",
      "css-layouts",
      "dom-manipulation",
      "react-fundamentals",
      "state-management",
      "api-integration",
      "nodejs-backend",
      "database-integration",
      "authentication-security",
      "deployment-production",
    ],
    estimatedDuration: 1200, // 20 hours
    difficulty: "advanced",
    outcomes: [
      {
        id: "web-frontend",
        description: "Build interactive frontend applications",
        bloomLevel: "create",
        assessable: true,
      },
      {
        id: "web-backend",
        description: "Develop backend APIs and services",
        bloomLevel: "create",
        assessable: true,
      },
      {
        id: "web-fullstack",
        description:
          "Integrate frontend and backend into complete applications",
        bloomLevel: "evaluate",
        assessable: true,
      },
    ],
  },
];

// Skill progression management functions
export class SkillProgressionManager {
  private userSkills: Map<string, SkillProgression> = new Map();

  constructor() {
    this.initializeSkills();
  }

  private initializeSkills(): void {
    Object.entries(skillLevels).forEach(([skillName, skillData]) => {
      this.userSkills.set(skillName, skillData);
    });
  }

  public getSkillProgression(skillName: string): SkillProgression | undefined {
    return this.userSkills.get(skillName);
  }

  public updateSkillProgress(skillName: string, progress: number): void {
    const skill = this.userSkills.get(skillName);
    if (skill) {
      skill.progress = Math.min(100, Math.max(0, progress));

      // Check if ready to advance to next level
      if (
        skill.progress >= 100 &&
        skill.currentLevel < skill.levels.length - 1
      ) {
        skill.currentLevel++;
        skill.progress = 0;
      }
    }
  }

  public getCurrentLevel(skillName: string): SkillLevel | undefined {
    const skill = this.userSkills.get(skillName);
    if (skill && skill.currentLevel < skill.levels.length) {
      return skill.levels[skill.currentLevel];
    }
    return undefined;
  }

  public getNextLevel(skillName: string): SkillLevel | undefined {
    const skill = this.userSkills.get(skillName);
    if (skill && skill.currentLevel + 1 < skill.levels.length) {
      return skill.levels[skill.currentLevel + 1];
    }
    return undefined;
  }

  public isSkillCompleted(skillName: string): boolean {
    const skill = this.userSkills.get(skillName);
    return skill
      ? skill.currentLevel === skill.levels.length - 1 && skill.progress === 100
      : false;
  }

  public getRecommendedLearningPath(completedSkills: string[]): LearningPath[] {
    return learningPaths
      .filter((path) => {
        // Check if prerequisites are met
        return path.prerequisites.every((prereq) =>
          completedSkills.includes(prereq),
        );
      })
      .sort((a, b) => {
        // Sort by difficulty and estimated duration
        const difficultyOrder = {
          beginner: 1,
          intermediate: 2,
          advanced: 3,
          expert: 4,
        };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      });
  }

  public calculateOverallProgress(): number {
    const skills = Array.from(this.userSkills.values());
    if (skills.length === 0) return 0;

    const totalProgress = skills.reduce((sum, skill) => {
      const levelProgress =
        (skill.currentLevel / (skill.levels.length - 1)) * 100;
      const currentLevelProgress =
        (skill.progress / 100) * (100 / skill.levels.length);
      return sum + levelProgress + currentLevelProgress;
    }, 0);

    return Math.round(totalProgress / skills.length);
  }

  public getSkillGaps(targetPath: LearningPath): string[] {
    const gaps: string[] = [];

    // Check each prerequisite skill level
    targetPath.prerequisites.forEach((prereq) => {
      if (!this.isSkillCompleted(prereq)) {
        gaps.push(prereq);
      }
    });

    return gaps;
  }

  public generatePersonalizedCurriculum(userGoals: string[]): LearningPath[] {
    const completedSkills = Array.from(this.userSkills.entries())
      .filter(([_, skill]) => this.isSkillCompleted(_))
      .map(([skillName, _]) => skillName);

    const relevantPaths = learningPaths.filter((path) =>
      userGoals.some(
        (goal) =>
          path.name.toLowerCase().includes(goal.toLowerCase()) ||
          path.description.toLowerCase().includes(goal.toLowerCase()),
      ),
    );

    const availablePaths = this.getRecommendedLearningPath(completedSkills);

    return relevantPaths.length > 0
      ? relevantPaths
      : availablePaths.slice(0, 3);
  }
}
