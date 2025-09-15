// Claude Flow Lesson Templates
// Modular lesson templates for different learning scenarios

import {
  LessonContent,
  CodeExample,
  Exercise,
  Assessment,
  Resource,
  LearningObjective,
} from "../types/curriculum";

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
  estimatedDuration: number; // minutes
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
  estimatedTime: number; // minutes
  contentGuidelines: string[];
  examples?: string[];
}

// Beginner-level reading lesson template
export const beginnerReadingTemplate: LessonTemplate = {
  id: "beginner-reading",
  name: "Beginner Reading Lesson",
  description:
    "Template for introductory reading-based lessons with basic concepts",
  type: "reading",
  skillLevel: "beginner",
  estimatedDuration: 15,
  structure: {
    introduction: {
      id: "intro",
      title: "Introduction",
      type: "text",
      required: true,
      estimatedTime: 2,
      contentGuidelines: [
        "Start with a clear learning objective",
        "Explain why this topic is important",
        "Provide a brief overview of what will be covered",
        "Connect to previously learned concepts",
      ],
      examples: [
        "Welcome to Introduction to Variables! In this lesson, you will learn what variables are and why they are essential in programming.",
        "By the end of this lesson, you will understand how to declare and use variables in JavaScript.",
      ],
    },
    learningContent: [
      {
        id: "concept-explanation",
        title: "Concept Explanation",
        type: "text",
        required: true,
        estimatedTime: 8,
        contentGuidelines: [
          "Break down complex concepts into simple terms",
          "Use analogies and real-world examples",
          "Include visual aids when possible",
          "Define key terminology clearly",
          "Build concepts incrementally",
        ],
        examples: [
          "Think of a variable as a labeled box where you can store information.",
          'Just like you might label a box "winter clothes" to remember what\'s inside, variables have names that help us remember what data they contain.',
        ],
      },
      {
        id: "examples-demonstration",
        title: "Examples and Demonstration",
        type: "interactive",
        required: true,
        estimatedTime: 4,
        contentGuidelines: [
          "Provide multiple concrete examples",
          "Show step-by-step processes",
          "Highlight common patterns",
          "Demonstrate best practices",
        ],
      },
    ],
    practiceActivities: [
      {
        id: "guided-practice",
        title: "Guided Practice",
        type: "exercise",
        required: true,
        estimatedTime: 5,
        contentGuidelines: [
          "Start with simple, low-stakes activities",
          "Provide immediate feedback",
          "Offer hints and guidance",
          "Allow multiple attempts",
        ],
      },
    ],
    assessment: {
      id: "knowledge-check",
      title: "Knowledge Check",
      type: "assessment",
      required: true,
      estimatedTime: 3,
      contentGuidelines: [
        "Focus on key learning objectives",
        "Use varied question types",
        "Provide explanatory feedback",
        "Assess understanding, not memorization",
      ],
    },
    closure: {
      id: "summary",
      title: "Summary and Next Steps",
      type: "text",
      required: true,
      estimatedTime: 2,
      contentGuidelines: [
        "Summarize key takeaways",
        "Connect to upcoming lessons",
        "Suggest additional practice opportunities",
        "Reinforce the value of what was learned",
      ],
    },
  },
};

// Hands-on coding lesson template
export const handsOnCodingTemplate: LessonTemplate = {
  id: "hands-on-coding",
  name: "Hands-On Coding Lesson",
  description:
    "Template for interactive coding lessons with practical exercises",
  type: "hands_on",
  skillLevel: "intermediate",
  estimatedDuration: 30,
  structure: {
    introduction: {
      id: "intro",
      title: "Setup and Objectives",
      type: "text",
      required: true,
      estimatedTime: 3,
      contentGuidelines: [
        "Clearly state what will be built or achieved",
        "List required tools and setup instructions",
        "Set expectations for difficulty level",
        "Motivate with real-world applications",
      ],
    },
    learningContent: [
      {
        id: "concept-review",
        title: "Concept Review",
        type: "text",
        required: true,
        estimatedTime: 5,
        contentGuidelines: [
          "Quickly review relevant concepts",
          "Highlight key principles that will be applied",
          "Provide reference materials",
          "Address common misconceptions",
        ],
      },
      {
        id: "demo-walkthrough",
        title: "Demonstration Walkthrough",
        type: "interactive",
        required: true,
        estimatedTime: 7,
        contentGuidelines: [
          "Show the complete process step-by-step",
          "Explain reasoning behind each decision",
          "Highlight best practices and patterns",
          "Demonstrate debugging techniques",
        ],
      },
    ],
    practiceActivities: [
      {
        id: "guided-coding",
        title: "Guided Coding Exercise",
        type: "exercise",
        required: true,
        estimatedTime: 10,
        contentGuidelines: [
          "Provide starter code and clear instructions",
          "Break down the task into smaller steps",
          "Offer hints at appropriate difficulty progression",
          "Include test cases to verify solutions",
        ],
      },
      {
        id: "independent-challenge",
        title: "Independent Challenge",
        type: "exercise",
        required: false,
        estimatedTime: 8,
        contentGuidelines: [
          "Present a related but unique problem",
          "Encourage creative problem-solving",
          "Provide extension opportunities",
          "Allow for multiple solution approaches",
        ],
      },
    ],
    assessment: {
      id: "code-review",
      title: "Code Review and Reflection",
      type: "assessment",
      required: true,
      estimatedTime: 5,
      contentGuidelines: [
        "Review solution approaches",
        "Discuss code quality and best practices",
        "Identify areas for improvement",
        "Celebrate successful problem-solving",
      ],
    },
    closure: {
      id: "wrap-up",
      title: "Wrap-up and Extensions",
      type: "text",
      required: true,
      estimatedTime: 2,
      contentGuidelines: [
        "Summarize skills developed",
        "Suggest ways to extend the project",
        "Connect to real-world applications",
        "Preview upcoming advanced topics",
      ],
    },
  },
};

// Project-based lesson template
export const projectBasedTemplate: LessonTemplate = {
  id: "project-based",
  name: "Project-Based Lesson",
  description:
    "Template for comprehensive project lessons that integrate multiple concepts",
  type: "project",
  skillLevel: "advanced",
  estimatedDuration: 60,
  structure: {
    introduction: {
      id: "project-overview",
      title: "Project Overview and Planning",
      type: "text",
      required: true,
      estimatedTime: 8,
      contentGuidelines: [
        "Present the project vision and end goals",
        "Explain the problem being solved",
        "Outline the development process",
        "Discuss project requirements and constraints",
      ],
    },
    learningContent: [
      {
        id: "technical-planning",
        title: "Technical Planning and Architecture",
        type: "interactive",
        required: true,
        estimatedTime: 12,
        contentGuidelines: [
          "Guide system design decisions",
          "Discuss technology choices and trade-offs",
          "Create project structure and components",
          "Establish coding standards and conventions",
        ],
      },
    ],
    practiceActivities: [
      {
        id: "implementation-phase1",
        title: "Implementation Phase 1: Core Features",
        type: "exercise",
        required: true,
        estimatedTime: 20,
        contentGuidelines: [
          "Focus on essential functionality first",
          "Implement and test core features",
          "Practice incremental development",
          "Emphasize clean, maintainable code",
        ],
      },
      {
        id: "implementation-phase2",
        title: "Implementation Phase 2: Enhancement and Polish",
        type: "exercise",
        required: true,
        estimatedTime: 15,
        contentGuidelines: [
          "Add advanced features and optimizations",
          "Implement error handling and edge cases",
          "Focus on user experience improvements",
          "Practice code refactoring techniques",
        ],
      },
    ],
    assessment: {
      id: "project-evaluation",
      title: "Project Evaluation and Peer Review",
      type: "assessment",
      required: true,
      estimatedTime: 10,
      contentGuidelines: [
        "Evaluate against project requirements",
        "Conduct code quality assessment",
        "Facilitate peer feedback sessions",
        "Reflect on learning outcomes achieved",
      ],
    },
    closure: {
      id: "reflection-next-steps",
      title: "Reflection and Next Steps",
      type: "text",
      required: true,
      estimatedTime: 5,
      contentGuidelines: [
        "Reflect on the development process",
        "Identify key learning takeaways",
        "Discuss potential improvements and extensions",
        "Connect to professional development practices",
      ],
    },
  },
};

// Assessment-focused lesson template
export const assessmentTemplate: LessonTemplate = {
  id: "assessment-focused",
  name: "Assessment-Focused Lesson",
  description:
    "Template for lessons primarily focused on evaluation and skill demonstration",
  type: "assessment",
  skillLevel: "intermediate",
  estimatedDuration: 45,
  structure: {
    introduction: {
      id: "assessment-intro",
      title: "Assessment Introduction and Instructions",
      type: "text",
      required: true,
      estimatedTime: 5,
      contentGuidelines: [
        "Clearly explain assessment format and expectations",
        "Review evaluation criteria and rubrics",
        "Provide time management suggestions",
        "Address any questions or concerns",
      ],
    },
    learningContent: [
      {
        id: "review-preparation",
        title: "Review and Preparation",
        type: "text",
        required: true,
        estimatedTime: 8,
        contentGuidelines: [
          "Briefly review key concepts to be assessed",
          "Provide quick reference materials",
          "Offer strategy tips for success",
          "Remind students of available resources",
        ],
      },
    ],
    practiceActivities: [
      {
        id: "formative-assessment",
        title: "Formative Assessment Activities",
        type: "assessment",
        required: true,
        estimatedTime: 25,
        contentGuidelines: [
          "Include varied assessment formats",
          "Progress from simple to complex tasks",
          "Provide immediate feedback when possible",
          "Allow for demonstration of different skill levels",
        ],
      },
    ],
    assessment: {
      id: "summative-evaluation",
      title: "Summative Evaluation",
      type: "assessment",
      required: true,
      estimatedTime: 5,
      contentGuidelines: [
        "Evaluate overall competency achievement",
        "Provide comprehensive feedback",
        "Identify strengths and growth areas",
        "Connect to learning objectives",
      ],
    },
    closure: {
      id: "feedback-planning",
      title: "Feedback and Learning Planning",
      type: "text",
      required: true,
      estimatedTime: 2,
      contentGuidelines: [
        "Provide constructive feedback on performance",
        "Suggest specific areas for improvement",
        "Recommend additional learning resources",
        "Plan next steps in learning journey",
      ],
    },
  },
};

export const lessonTemplates = {
  beginnerReading: beginnerReadingTemplate,
  handsOnCoding: handsOnCodingTemplate,
  projectBased: projectBasedTemplate,
  assessment: assessmentTemplate,
};

// Template application function
export function applyLessonTemplate(
  template: LessonTemplate,
  customizations: Partial<LessonContent>,
): LessonContent {
  const baseContent: LessonContent = {
    version: "1.0",
    sections: [],
    interactiveElements: [],
    codeExamples: [],
    exercises: [],
    assessments: [],
    resources: [],
    metadata: {
      author: "",
      lastModified: new Date(),
      version: "1.0",
      keywords: [],
      difficulty: template.skillLevel,
      estimatedTime: template.estimatedDuration,
    },
  };

  // Apply template structure to create sections
  const templateSections = [
    template.structure.introduction,
    ...template.structure.learningContent,
    ...template.structure.practiceActivities,
    template.structure.assessment,
    template.structure.closure,
  ];

  baseContent.sections = templateSections.map((section, index) => ({
    id: section.id,
    title: section.title,
    type: section.type as any,
    content: "", // To be filled in by content creator
    order: index,
    timeEstimate: section.estimatedTime,
  }));

  // Merge with customizations
  return {
    ...baseContent,
    ...customizations,
  };
}
