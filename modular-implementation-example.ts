/**
 * Modular Lesson Implementation Example
 * Demonstrates how to use the new content block architecture
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface ContentBlock {
  id: string;
  title: string;
  type: 'text' | 'video' | 'code' | 'quiz' | 'exercise' | 'interactive' | 'assessment';
  content: BlockContent;
  estimatedTimeMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  isReusable: boolean;
}

export interface BlockContent {
  // Type-specific content structures
  text?: {
    format: 'markdown' | 'html';
    content: string;
    images?: Array<{ url: string; alt: string; caption?: string }>;
    callouts?: Array<{ type: 'info' | 'warning' | 'tip'; content: string }>;
  };
  video?: {
    videoUrl: string;
    thumbnailUrl?: string;
    durationSeconds: number;
    chapters?: Array<{ title: string; startTime: number }>;
    subtitles?: Array<{ lang: string; url: string }>;
  };
  code?: {
    language: string;
    code: string;
    explanation?: string;
    runnable: boolean;
    expectedOutput?: string;
    testCases?: Array<{ input: string; expected: string }>;
  };
  quiz?: {
    questions: Array<{
      id: string;
      question: string;
      type: 'multiple-choice' | 'true-false' | 'short-answer';
      options?: string[];
      correctAnswer: string | string[];
      explanation?: string;
    }>;
    passingScore: number;
    allowMultipleAttempts: boolean;
  };
  exercise?: {
    instructions: string;
    startingCode?: string;
    solution?: string;
    hints?: string[];
    testCases: Array<{ input: string; expected: string; description: string }>;
  };
}

export interface LessonStructure {
  id: string;
  name: string;
  slug: string;
  description: string;
  estimatedDurationMinutes: number;
  sections: {
    introduction: ContentBlock[];
    content: ContentBlock[];
    practice: ContentBlock[];
    assessment: ContentBlock[];
    closure: ContentBlock[];
  };
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

export class ModularLessonRepository {
  private db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  /**
   * Create a new content block
   */
  async createContentBlock(block: Omit<ContentBlock, 'id'>): Promise<ContentBlock> {
    const query = `
      INSERT INTO content_blocks (
        title, type, content, estimated_time_minutes,
        difficulty, tags, is_reusable, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'published')
      RETURNING *
    `;

    const result = await this.db.query(query, [
      block.title,
      block.type,
      JSON.stringify(block.content),
      block.estimatedTimeMinutes,
      block.difficulty,
      block.tags,
      block.isReusable
    ]);

    return this.mapRowToBlock(result.rows[0]);
  }

  /**
   * Create a modular lesson by composing blocks
   */
  async createModularLesson(
    lessonData: {
      topicId: string;
      name: string;
      slug: string;
      description: string;
    },
    blockComposition: {
      section: string;
      blockId: string;
      orderIndex: number;
      customTitle?: string;
      required?: boolean;
    }[]
  ): Promise<string> {
    const client = await this.db.getClient();

    try {
      await client.query('BEGIN');

      // Create lesson
      const lessonQuery = `
        INSERT INTO lessons_v2 (topic_id, name, slug, description)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `;
      const lessonResult = await client.query(lessonQuery, [
        lessonData.topicId,
        lessonData.name,
        lessonData.slug,
        lessonData.description
      ]);

      const lessonId = lessonResult.rows[0].id;

      // Add blocks to lesson
      const blockQuery = `
        INSERT INTO lesson_blocks (
          lesson_id, block_id, section, order_index,
          custom_title, required
        )
        VALUES ($1, $2, $3, $4, $5, $6)
      `;

      for (const block of blockComposition) {
        await client.query(blockQuery, [
          lessonId,
          block.blockId,
          block.section,
          block.orderIndex,
          block.customTitle || null,
          block.required ?? true
        ]);
      }

      await client.query('COMMIT');
      return lessonId;

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get complete lesson structure with blocks
   */
  async getLessonStructure(lessonId: string): Promise<LessonStructure> {
    const query = `
      SELECT
        l.id, l.name, l.slug, l.description,
        l.estimated_duration_minutes,
        lb.section, lb.order_index,
        cb.id as block_id, cb.title as block_title,
        cb.type, cb.content, cb.estimated_time_minutes,
        cb.difficulty, cb.tags, cb.is_reusable,
        lb.custom_title, lb.required
      FROM lessons_v2 l
      JOIN lesson_blocks lb ON l.id = lb.lesson_id
      JOIN content_blocks cb ON lb.block_id = cb.id
      WHERE l.id = $1 AND l.is_active = true AND cb.is_active = true
      ORDER BY lb.section, lb.order_index
    `;

    const result = await this.db.query(query, [lessonId]);
    return this.mapRowsToLessonStructure(result.rows);
  }

  /**
   * Get reusable blocks for lesson building
   */
  async getReusableBlocks(filters?: {
    type?: string;
    difficulty?: string;
    tags?: string[];
  }): Promise<ContentBlock[]> {
    let query = `
      SELECT * FROM content_blocks
      WHERE is_reusable = true AND is_active = true
    `;
    const params: any[] = [];

    if (filters?.type) {
      params.push(filters.type);
      query += ` AND type = $${params.length}`;
    }

    if (filters?.difficulty) {
      params.push(filters.difficulty);
      query += ` AND difficulty = $${params.length}`;
    }

    if (filters?.tags && filters.tags.length > 0) {
      params.push(filters.tags);
      query += ` AND tags && $${params.length}`;
    }

    query += ` ORDER BY title`;

    const result = await this.db.query(query, params);
    return result.rows.map(row => this.mapRowToBlock(row));
  }

  private mapRowToBlock(row: any): ContentBlock {
    return {
      id: row.id,
      title: row.title,
      type: row.type,
      content: row.content,
      estimatedTimeMinutes: row.estimated_time_minutes,
      difficulty: row.difficulty,
      tags: row.tags || [],
      isReusable: row.is_reusable
    };
  }

  private mapRowsToLessonStructure(rows: any[]): LessonStructure {
    if (rows.length === 0) {
      throw new Error('Lesson not found');
    }

    const lesson = rows[0];
    const sections = {
      introduction: [],
      content: [],
      practice: [],
      assessment: [],
      closure: []
    };

    for (const row of rows) {
      const block: ContentBlock = {
        id: row.block_id,
        title: row.custom_title || row.block_title,
        type: row.type,
        content: row.content,
        estimatedTimeMinutes: row.estimated_time_minutes,
        difficulty: row.difficulty,
        tags: row.tags || [],
        isReusable: row.is_reusable
      };

      if (sections[row.section as keyof typeof sections]) {
        sections[row.section as keyof typeof sections].push(block);
      }
    }

    return {
      id: lesson.id,
      name: lesson.name,
      slug: lesson.slug,
      description: lesson.description,
      estimatedDurationMinutes: lesson.estimated_duration_minutes,
      sections
    };
  }
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

export class ModularLessonController {
  constructor(private lessonRepo: ModularLessonRepository) {}

  /**
   * GET /api/lessons/:id/modular
   * Get lesson with modular structure
   */
  async getLessonModular(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const lesson = await this.lessonRepo.getLessonStructure(id);
      res.json(lesson);
    } catch (error) {
      res.status(404).json({ error: 'Lesson not found' });
    }
  }

  /**
   * GET /api/blocks
   * Get available content blocks for lesson building
   */
  async getBlocks(req: Request, res: Response) {
    try {
      const filters = {
        type: req.query.type as string,
        difficulty: req.query.difficulty as string,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined
      };

      const blocks = await this.lessonRepo.getReusableBlocks(filters);
      res.json(blocks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blocks' });
    }
  }

  /**
   * POST /api/blocks
   * Create a new content block
   */
  async createBlock(req: Request, res: Response) {
    try {
      const blockData = req.body;
      const block = await this.lessonRepo.createContentBlock(blockData);
      res.status(201).json(block);
    } catch (error) {
      res.status(400).json({ error: 'Failed to create block' });
    }
  }

  /**
   * POST /api/lessons/modular
   * Create a lesson from blocks
   */
  async createModularLesson(req: Request, res: Response) {
    try {
      const { lessonData, blockComposition } = req.body;
      const lessonId = await this.lessonRepo.createModularLesson(
        lessonData,
        blockComposition
      );
      res.status(201).json({ id: lessonId });
    } catch (error) {
      res.status(400).json({ error: 'Failed to create lesson' });
    }
  }
}

// ============================================================================
// FRONTEND COMPONENTS
// ============================================================================

import React, { useState, useEffect } from 'react';

/**
 * Content Block Renderer Component
 */
export const ContentBlockRenderer: React.FC<{ block: ContentBlock }> = ({ block }) => {
  switch (block.type) {
    case 'text':
      return <TextBlock content={block.content.text!} />;
    case 'video':
      return <VideoBlock content={block.content.video!} />;
    case 'code':
      return <CodeBlock content={block.content.code!} />;
    case 'quiz':
      return <QuizBlock content={block.content.quiz!} />;
    case 'exercise':
      return <ExerciseBlock content={block.content.exercise!} />;
    default:
      return <div>Unsupported block type: {block.type}</div>;
  }
};

const TextBlock: React.FC<{ content: NonNullable<BlockContent['text']> }> = ({ content }) => {
  const renderContent = () => {
    if (content.format === 'html') {
      return <div dangerouslySetInnerHTML={{ __html: content.content }} />;
    }
    // Convert markdown to HTML (simplified)
    const html = content.content
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="text-block">
      {renderContent()}
      {content.images?.map((img, index) => (
        <figure key={index}>
          <img src={img.url} alt={img.alt} />
          {img.caption && <figcaption>{img.caption}</figcaption>}
        </figure>
      ))}
      {content.callouts?.map((callout, index) => (
        <div key={index} className={`callout callout-${callout.type}`}>
          {callout.content}
        </div>
      ))}
    </div>
  );
};

const CodeBlock: React.FC<{ content: NonNullable<BlockContent['code']> }> = ({ content }) => {
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    if (!content.runnable) return;

    setIsRunning(true);
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOutput(content.expectedOutput || 'Code executed successfully!');
    } catch (error) {
      setOutput('Error executing code');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="code-block">
      {content.explanation && (
        <div className="code-explanation">{content.explanation}</div>
      )}
      <div className="code-container">
        <pre className={`language-${content.language}`}>
          <code>{content.code}</code>
        </pre>
        {content.runnable && (
          <button onClick={runCode} disabled={isRunning}>
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        )}
      </div>
      {output && (
        <div className="code-output">
          <strong>Output:</strong>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
};

/**
 * Modular Lesson Viewer Component
 */
export const ModularLessonViewer: React.FC<{ lessonId: string }> = ({ lessonId }) => {
  const [lesson, setLesson] = useState<LessonStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState('introduction');

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(`/api/lessons/${lessonId}/modular`);
        const data = await response.json();
        setLesson(data);
      } catch (error) {
        console.error('Failed to fetch lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  if (loading) return <div>Loading lesson...</div>;
  if (!lesson) return <div>Lesson not found</div>;

  const sections = Object.keys(lesson.sections) as Array<keyof typeof lesson.sections>;

  return (
    <div className="modular-lesson">
      <header className="lesson-header">
        <h1>{lesson.name}</h1>
        <p>{lesson.description}</p>
        <div className="lesson-meta">
          <span>~{lesson.estimatedDurationMinutes} minutes</span>
        </div>
      </header>

      <nav className="lesson-navigation">
        {sections.map(section => (
          <button
            key={section}
            className={currentSection === section ? 'active' : ''}
            onClick={() => setCurrentSection(section)}
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </button>
        ))}
      </nav>

      <main className="lesson-content">
        <div className={`lesson-section section-${currentSection}`}>
          {lesson.sections[currentSection as keyof typeof lesson.sections].map(block => (
            <div key={block.id} className="content-block">
              <header className="block-header">
                <h3>{block.title}</h3>
                <span className="block-meta">
                  {block.type} • ~{block.estimatedTimeMinutes}min • {block.difficulty}
                </span>
              </header>
              <ContentBlockRenderer block={block} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

/**
 * Block Library Component for Lesson Building
 */
export const BlockLibrary: React.FC<{
  onBlockSelect: (block: ContentBlock) => void;
}> = ({ onBlockSelect }) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [filters, setFilters] = useState({
    type: '',
    difficulty: '',
    search: ''
  });

  useEffect(() => {
    const fetchBlocks = async () => {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);

      const response = await fetch(`/api/blocks?${params}`);
      const data = await response.json();
      setBlocks(data);
    };

    fetchBlocks();
  }, [filters]);

  return (
    <div className="block-library">
      <div className="library-filters">
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="text">Text</option>
          <option value="video">Video</option>
          <option value="code">Code</option>
          <option value="quiz">Quiz</option>
          <option value="exercise">Exercise</option>
        </select>

        <select
          value={filters.difficulty}
          onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
        >
          <option value="">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>

        <input
          type="text"
          placeholder="Search blocks..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
      </div>

      <div className="block-grid">
        {blocks
          .filter(block =>
            !filters.search ||
            block.title.toLowerCase().includes(filters.search.toLowerCase())
          )
          .map(block => (
            <div
              key={block.id}
              className="block-card"
              onClick={() => onBlockSelect(block)}
            >
              <div className="block-type">{block.type}</div>
              <h4>{block.title}</h4>
              <div className="block-meta">
                <span>{block.difficulty}</span>
                <span>{block.estimatedTimeMinutes}min</span>
              </div>
              <div className="block-tags">
                {block.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

// ============================================================================
// USAGE EXAMPLE
// ============================================================================

/**
 * Example: Creating a Programming Lesson with Modular Blocks
 */
export async function createJavaScriptVariablesLesson(repo: ModularLessonRepository) {
  // 1. Create individual content blocks
  const introBlock = await repo.createContentBlock({
    title: 'Introduction to Variables',
    type: 'text',
    content: {
      text: {
        format: 'markdown',
        content: `# Variables in JavaScript

Variables are containers that store data values. In JavaScript, you can create variables using \`let\`, \`const\`, or \`var\`.

## Why Variables Matter
- Store and reuse data
- Make code more readable
- Enable dynamic behavior`,
        callouts: [{
          type: 'tip',
          content: 'Modern JavaScript prefers `let` and `const` over `var`'
        }]
      }
    },
    estimatedTimeMinutes: 3,
    difficulty: 'beginner',
    tags: ['javascript', 'variables', 'basics'],
    isReusable: true
  });

  const codeBlock = await repo.createContentBlock({
    title: 'Variable Declaration Examples',
    type: 'code',
    content: {
      code: {
        language: 'javascript',
        code: `// Using let for mutable variables
let age = 25;
let name = 'Alice';

// Using const for immutable values
const PI = 3.14159;
const isStudent = true;

// Updating variables
age = 26; // ✅ Valid
// PI = 3.14; // ❌ Error - cannot reassign const

console.log(\`\${name} is \${age} years old\`);`,
        explanation: 'This example shows the difference between `let` and `const`, and demonstrates template literals.',
        runnable: true,
        expectedOutput: 'Alice is 26 years old'
      }
    },
    estimatedTimeMinutes: 5,
    difficulty: 'beginner',
    tags: ['javascript', 'variables', 'examples'],
    isReusable: true
  });

  const exerciseBlock = await repo.createContentBlock({
    title: 'Practice: Create Your Own Variables',
    type: 'exercise',
    content: {
      exercise: {
        instructions: 'Create variables to store information about a book: title, author, pages, and whether it\'s available.',
        startingCode: '// Create variables for a book\n// Your code here...',
        solution: `const title = 'The Great Gatsby';
const author = 'F. Scott Fitzgerald';
const pages = 180;
let isAvailable = true;

console.log(\`\${title} by \${author} has \${pages} pages\`);`,
        hints: [
          'Use `const` for values that won\'t change',
          'Use `let` for values that might change',
          'String values need quotes'
        ],
        testCases: [
          {
            input: 'Check if variables are declared',
            expected: 'Variables should be properly declared with const/let',
            description: 'Verify correct variable declarations'
          }
        ]
      }
    },
    estimatedTimeMinutes: 8,
    difficulty: 'beginner',
    tags: ['javascript', 'variables', 'practice'],
    isReusable: false
  });

  // 2. Create the lesson by composing blocks
  const lessonId = await repo.createModularLesson(
    {
      topicId: 'some-topic-id',
      name: 'JavaScript Variables Fundamentals',
      slug: 'javascript-variables-fundamentals',
      description: 'Learn how to declare and use variables in JavaScript'
    },
    [
      { section: 'introduction', blockId: introBlock.id, orderIndex: 0 },
      { section: 'content', blockId: codeBlock.id, orderIndex: 0 },
      { section: 'practice', blockId: exerciseBlock.id, orderIndex: 0 }
    ]
  );

  return lessonId;
}

export default {
  ModularLessonRepository,
  ModularLessonController,
  ContentBlockRenderer,
  ModularLessonViewer,
  BlockLibrary
};