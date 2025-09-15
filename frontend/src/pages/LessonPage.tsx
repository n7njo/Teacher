import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

interface ContentBlock {
  id: string;
  title: string;
  type:
    | "text"
    | "video"
    | "code"
    | "quiz"
    | "exercise"
    | "interactive"
    | "assessment";
  content: any;
  estimatedTimeMinutes: number;
  difficulty: string;
  tags: string[];
  required: boolean;
  customInstructions?: string;
}

interface ModularLesson {
  id: string;
  name: string;
  description: string;
  estimatedDurationMinutes: number;
  type: "modular" | "legacy";
  sections: {
    introduction: ContentBlock[];
    content: ContentBlock[];
    practice: ContentBlock[];
    assessment: ContentBlock[];
    closure: ContentBlock[];
  };
}

interface LegacyLesson {
  id: string;
  name: string;
  description: string;
  content: any;
  estimated_duration_minutes: number;
  lesson_type: string;
  type: "legacy";
}

type Lesson = ModularLesson | LegacyLesson;

// Content block renderers
const ContentBlockRenderer: React.FC<{ block: ContentBlock }> = ({ block }) => {
  const renderBlockContent = () => {
    switch (block.type) {
      case "text":
        return <TextBlock content={block.content} />;
      case "video":
        return <VideoBlock content={block.content} />;
      case "code":
        return <CodeBlock content={block.content} />;
      case "quiz":
        return <QuizBlock content={block.content} />;
      case "exercise":
        return <ExerciseBlock content={block.content} />;
      case "interactive":
        // For migrated interactive content, often it's really text with tables/complex HTML
        return <TextBlock content={block.content} />;
      case "assessment":
        // Assessment blocks can be treated like quiz blocks for now
        return <QuizBlock content={block.content} />;
      default:
        return <GenericBlock content={block.content} />;
    }
  };

  return (
    <div
      className="content-block"
      style={{
        marginBottom: "2rem",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "1.5rem",
      }}
    >
      <header
        className="block-header"
        style={{
          marginBottom: "1rem",
          paddingBottom: "0.5rem",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <h3 style={{ margin: 0, color: "#333" }}>{block.title}</h3>
        <div
          className="block-meta"
          style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.25rem" }}
        >
          <span
            className="block-type"
            style={{
              background: getTypeColor(block.type),
              color: "white",
              padding: "2px 8px",
              borderRadius: "12px",
              marginRight: "8px",
              fontSize: "0.75rem",
              fontWeight: "bold",
            }}
          >
            {block.type}
          </span>
          <span>~{block.estimatedTimeMinutes}min</span>
          <span style={{ marginLeft: "8px" }}>{block.difficulty}</span>
          {block.required && (
            <span style={{ marginLeft: "8px", color: "#e74c3c" }}>*</span>
          )}
        </div>
        {block.customInstructions && (
          <div
            className="custom-instructions"
            style={{
              marginTop: "0.5rem",
              padding: "0.5rem",
              background: "#f8f9fa",
              borderRadius: "4px",
              fontSize: "0.9rem",
              fontStyle: "italic",
            }}
          >
            {block.customInstructions}
          </div>
        )}
      </header>
      <div className="block-content">{renderBlockContent()}</div>
    </div>
  );
};

const TextBlock: React.FC<{ content: any }> = ({ content }) => {
  const [expandedCode, setExpandedCode] = useState<{ [key: number]: boolean }>(
    {},
  );

  const processHtmlContent = (htmlContent: string) => {
    // Split content by code blocks but keep them in the array
    const parts = htmlContent.split(/(<pre><code>[\s\S]*?<\/code><\/pre>)/);

    return parts
      .map((part, index) => {
        // Check if this part is a code block
        const codeMatch = part.match(/<pre><code>([\s\S]*?)<\/code><\/pre>/);

        if (codeMatch) {
          const rawCode = codeMatch[1];
          const cleanCode = rawCode
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&amp;/g, "&")
            .replace(/&#x27;/g, "'")
            .replace(/&quot;/g, '"');

          const isExpanded = expandedCode[index];
          const codeLines = cleanCode.split("\n");
          const isLongCode = codeLines.length > 4;
          const displayCode =
            !isExpanded && isLongCode
              ? codeLines.slice(0, 3).join("\n") + "\n# ... (click to expand)"
              : cleanCode;

          return (
            <div
              key={index}
              className="embedded-code-block"
              style={{
                margin: "1.5rem 0",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "#f8fafc",
                  padding: "0.5rem 1rem",
                  borderBottom: "1px solid #e5e7eb",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#374151",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>💻 Command</span>
                {isLongCode && (
                  <button
                    onClick={() =>
                      setExpandedCode((prev) => ({
                        ...prev,
                        [index]: !prev[index],
                      }))
                    }
                    style={{
                      background: "none",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      padding: "0.25rem 0.5rem",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      color: "#6b7280",
                    }}
                  >
                    {isExpanded ? "Collapse" : "Expand"}
                  </button>
                )}
              </div>
              <pre
                style={{
                  background: "#1f2937",
                  color: "#f9fafb",
                  padding: "1rem",
                  margin: 0,
                  overflow: "auto",
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  fontSize: "0.875rem",
                  lineHeight: "1.5",
                }}
              >
                <code>{displayCode}</code>
              </pre>
              <div
                style={{
                  background: "#f8fafc",
                  padding: "0.5rem 1rem",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <button
                  onClick={() => navigator.clipboard?.writeText(cleanCode)}
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.375rem 0.75rem",
                    fontSize: "0.75rem",
                    cursor: "pointer",
                    marginRight: "0.5rem",
                  }}
                >
                  📋 Copy
                </button>
                <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                  Run this in your terminal
                </span>
              </div>
            </div>
          );
        } else if (part.trim()) {
          // Regular text content - clean up and format
          const cleanHtml = part
            .replace(/\n\n+/g, "</p><p>") // Convert double newlines to paragraphs
            .replace(/^(?!<[ph])/gm, "<p>") // Wrap text that doesn't start with HTML tags
            .replace(/(?<!>)$/gm, "</p>"); // Close paragraphs

          return (
            <div
              key={index}
              className="text-content"
              style={{
                lineHeight: "1.6",
                color: "#374151",
              }}
            >
              <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
            </div>
          );
        }
        return null;
      })
      .filter(Boolean);
  };

  // Handle structured text content
  if (content.text) {
    const textContent = content.text;
    if (textContent.format === "html") {
      const hasCodeBlocks = textContent.content.includes("<pre><code>");

      if (hasCodeBlocks) {
        return (
          <div className="mixed-content">
            {processHtmlContent(textContent.content)}
          </div>
        );
      } else {
        return (
          <div dangerouslySetInnerHTML={{ __html: textContent.content }} />
        );
      }
    }
    // Handle markdown or plain text
    return <div dangerouslySetInnerHTML={{ __html: textContent.content }} />;
  }

  // Fallback for legacy format or direct HTML content
  if (typeof content === "string") {
    if (content.includes("<pre><code>")) {
      return <div className="mixed-content">{processHtmlContent(content)}</div>;
    }
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // If content has an html property (legacy format)
  if (content.html) {
    if (content.html.includes("<pre><code>")) {
      return (
        <div className="mixed-content">{processHtmlContent(content.html)}</div>
      );
    }
    return <div dangerouslySetInnerHTML={{ __html: content.html }} />;
  }

  // If content is directly HTML/text
  if (content.content && typeof content.content === "string") {
    return <div dangerouslySetInnerHTML={{ __html: content.content }} />;
  }

  return <div>Text content not available</div>;
};

const VideoBlock: React.FC<{ content: any }> = ({ content }) => {
  if (content.video) {
    return (
      <div className="video-block">
        <video controls style={{ width: "100%", maxWidth: "800px" }}>
          <source src={content.video.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {content.video.chapters && (
          <div className="video-chapters" style={{ marginTop: "1rem" }}>
            <h4>Chapters:</h4>
            <ul>
              {content.video.chapters.map((chapter: any, index: number) => (
                <li key={index}>
                  {chapter.title} ({chapter.startTime}s)
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
  return <div>Video content not available</div>;
};

const CodeBlock: React.FC<{ content: any }> = ({ content }) => {
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setOutput("Code executed successfully!");
      setIsRunning(false);
    }, 1000);
  };

  // Handle structured code content
  if (content.code) {
    return (
      <div className="code-block">
        {content.code.explanation && (
          <div
            className="code-explanation"
            style={{ marginBottom: "1rem", color: "#555" }}
          >
            {content.code.explanation}
          </div>
        )}
        <div className="code-container">
          <pre
            style={{
              background: "#f4f4f4",
              padding: "1rem",
              borderRadius: "4px",
              overflow: "auto",
              border: "1px solid #ddd",
            }}
          >
            <code>{content.code.code}</code>
          </pre>
          {content.code.runnable && (
            <button
              onClick={runCode}
              disabled={isRunning}
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isRunning ? "not-allowed" : "pointer",
              }}
            >
              {isRunning ? "Running..." : "Run Code"}
            </button>
          )}
        </div>
        {output && (
          <div
            className="code-output"
            style={{
              marginTop: "1rem",
              padding: "1rem",
              background: "#e8f5e8",
              border: "1px solid #c3e6c3",
              borderRadius: "4px",
            }}
          >
            <strong>Output:</strong>
            <pre>{output}</pre>
          </div>
        )}
      </div>
    );
  }

  // Handle migrated content that contains HTML with code blocks
  if (content.text && content.text.content) {
    const htmlContent = content.text.content;

    // Extract code from <pre><code> blocks
    const codeMatch = htmlContent.match(/<pre><code>([\s\S]*?)<\/code><\/pre>/);
    if (codeMatch) {
      const extractedCode = codeMatch[1]
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&#x27;/g, "'")
        .replace(/&quot;/g, '"');

      return (
        <div className="code-block">
          <div className="code-container">
            <pre
              style={{
                background: "#f4f4f4",
                padding: "1rem",
                borderRadius: "4px",
                overflow: "auto",
                border: "1px solid #ddd",
              }}
            >
              <code>{extractedCode}</code>
            </pre>
            <button
              onClick={runCode}
              disabled={isRunning}
              style={{
                marginTop: "0.5rem",
                padding: "0.5rem 1rem",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: isRunning ? "not-allowed" : "pointer",
              }}
            >
              {isRunning ? "Running..." : "Try It"}
            </button>
          </div>
          {output && (
            <div
              className="code-output"
              style={{
                marginTop: "1rem",
                padding: "1rem",
                background: "#e8f5e8",
                border: "1px solid #c3e6c3",
                borderRadius: "4px",
              }}
            >
              <strong>Output:</strong>
              <pre>{output}</pre>
            </div>
          )}
          {/* Show any additional text content around the code */}
          <div style={{ marginTop: "1rem" }}>
            <div
              dangerouslySetInnerHTML={{
                __html: htmlContent.replace(
                  /<pre><code>[\s\S]*?<\/code><\/pre>/,
                  "",
                ),
              }}
            />
          </div>
        </div>
      );
    }

    // Fallback to text rendering for code-type blocks without <pre><code>
    return <TextBlock content={content} />;
  }

  return <div>Code content not available</div>;
};

const QuizBlock: React.FC<{ content: any }> = ({ content }) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);

  if (content.quiz) {
    return (
      <div className="quiz-block">
        <div className="quiz-questions">
          {content.quiz.questions?.map((question: any, index: number) => (
            <div
              key={question.id || index}
              style={{
                marginBottom: "1.5rem",
                padding: "1rem",
                background: "#f9f9f9",
                borderRadius: "4px",
              }}
            >
              <h4>{question.question}</h4>
              {question.type === "multiple-choice" &&
                question.options?.map((option: string, optionIndex: number) => (
                  <label
                    key={optionIndex}
                    style={{ display: "block", marginBottom: "0.5rem" }}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      onChange={(e) =>
                        setAnswers({
                          ...answers,
                          [`question-${index}`]: e.target.value,
                        })
                      }
                      style={{ marginRight: "0.5rem" }}
                    />
                    {option}
                  </label>
                ))}
              {showResults && question.explanation && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.5rem",
                    background: "#e3f2fd",
                    borderRadius: "4px",
                  }}
                >
                  <strong>Explanation:</strong> {question.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowResults(!showResults)}
          style={{
            padding: "0.5rem 1rem",
            background: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {showResults ? "Hide Results" : "Check Answers"}
        </button>
      </div>
    );
  }
  return <div>Quiz content not available</div>;
};

const ExerciseBlock: React.FC<{ content: any }> = ({ content }) => {
  const [userCode, setUserCode] = useState(
    content.exercise?.startingCode || "",
  );
  const [showSolution, setShowSolution] = useState(false);

  if (content.exercise) {
    return (
      <div className="exercise-block">
        <div className="exercise-instructions" style={{ marginBottom: "1rem" }}>
          <h4>Instructions:</h4>
          <p>{content.exercise.instructions}</p>
        </div>

        <textarea
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          style={{
            width: "100%",
            height: "200px",
            fontFamily: "monospace",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
          placeholder="Write your code here..."
        />

        {content.exercise.hints && (
          <details style={{ marginBottom: "1rem" }}>
            <summary style={{ cursor: "pointer", fontWeight: "bold" }}>
              💡 Hints
            </summary>
            <ul style={{ marginTop: "0.5rem" }}>
              {content.exercise.hints.map((hint: string, index: number) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </details>
        )}

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <button
            style={{
              padding: "0.5rem 1rem",
              background: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Test Code
          </button>
          <button
            onClick={() => setShowSolution(!showSolution)}
            style={{
              padding: "0.5rem 1rem",
              background: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {showSolution ? "Hide Solution" : "Show Solution"}
          </button>
        </div>

        {showSolution && content.exercise.solution && (
          <div
            className="solution"
            style={{
              padding: "1rem",
              background: "#f8f9fa",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
            }}
          >
            <h4>Solution:</h4>
            <pre>
              <code>{content.exercise.solution}</code>
            </pre>
          </div>
        )}
      </div>
    );
  }
  return <div>Exercise content not available</div>;
};

const GenericBlock: React.FC<{ content: any }> = ({ content }) => {
  // For migrated content, try to render as text first
  if (content.text && content.text.content) {
    return <TextBlock content={content} />;
  }

  // If there's direct HTML content
  if (content.html) {
    return <div dangerouslySetInnerHTML={{ __html: content.html }} />;
  }

  // If content is a string
  if (typeof content === "string") {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  // Fallback to JSON display
  return (
    <div
      style={{ padding: "1rem", background: "#f8f9fa", borderRadius: "4px" }}
    >
      <p style={{ marginBottom: "0.5rem", fontWeight: "bold", color: "#666" }}>
        Raw content (for debugging):
      </p>
      <pre
        style={{ whiteSpace: "pre-wrap", overflow: "auto", fontSize: "0.8rem" }}
      >
        {JSON.stringify(content, null, 2)}
      </pre>
    </div>
  );
};

// Helper function for block type colors
const getTypeColor = (type: string): string => {
  const colors: { [key: string]: string } = {
    text: "#007bff",
    video: "#dc3545",
    code: "#28a745",
    quiz: "#ffc107",
    exercise: "#17a2b8",
    interactive: "#6f42c1",
    assessment: "#fd7e14",
  };
  return colors[type] || "#6c757d";
};

interface LessonPageProps {
  onLessonDataLoad?: (data: any) => void;
  onToggleSidebar?: () => void;
}

const LessonPage: React.FC<LessonPageProps> = ({
  onLessonDataLoad,
  onToggleSidebar,
}) => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState("introduction");

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;

      try {
        // Try modular API first, fallback to legacy
        const response = await axios.get(`/api/modular/lessons/${lessonId}`);
        const lessonData = response.data;
        setLesson(lessonData);

        // Pass lesson data to parent for sidebar
        if (onLessonDataLoad && lessonData.type === "modular") {
          onLessonDataLoad(lessonData);
        }
      } catch (err) {
        setError("Failed to load lesson. Please try again later.");
        console.error("Error fetching lesson:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const renderLessonContent = (content: any) => {
    if (typeof content === "string") {
      return <div dangerouslySetInnerHTML={{ __html: content }} />;
    }

    if (content.html) {
      return <div dangerouslySetInnerHTML={{ __html: content.html }} />;
    }

    if (content.markdown) {
      // Simple markdown-to-HTML conversion for basic formatting
      let html = content.markdown
        .replace(/^# (.*$)/gm, "<h1>$1</h1>")
        .replace(/^## (.*$)/gm, "<h2>$1</h2>")
        .replace(/^### (.*$)/gm, "<h3>$1</h3>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/`(.*?)`/g, "<code>$1</code>")
        .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
        .replace(/\n\n/g, "</p><p>")
        .replace(/^\s*/, "<p>")
        .replace(/\s*$/, "</p>");

      return <div dangerouslySetInnerHTML={{ __html: html }} />;
    }

    // Fallback to JSON display
    return <pre>{JSON.stringify(content, null, 2)}</pre>;
  };

  if (loading) {
    return <div className="loading">Loading lesson...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!lesson) {
    return <div className="error">Lesson not found</div>;
  }

  // Render modular lesson
  const renderModularLesson = (modularLesson: ModularLesson) => {
    const sections = Object.keys(modularLesson.sections) as Array<
      keyof typeof modularLesson.sections
    >;
    const currentSectionBlocks =
      modularLesson.sections[
        currentSection as keyof typeof modularLesson.sections
      ] || [];

    return (
      <div className="fade-in">
        {/* Enhanced Breadcrumb */}
        <div
          className="breadcrumb"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "2rem",
            fontSize: "0.9rem",
          }}
        >
          <Link to="/">🏠 Home</Link>
          <span className="breadcrumb-separator">›</span>
          <span>📚 Lesson</span>
        </div>

        {/* Lesson Header Card */}
        <div className="glass-card" style={{ marginBottom: "2rem" }}>
          <header className="lesson-header">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <div style={{ flex: 1, minWidth: "300px" }}>
                <h1
                  style={{
                    fontSize: "2.5rem",
                    margin: "0 0 1rem 0",
                    background: "var(--gradient-accent)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontWeight: "700",
                    lineHeight: "1.2",
                  }}
                >
                  {modularLesson.name}
                </h1>
                {modularLesson.description && (
                  <p
                    style={{
                      fontSize: "1.1rem",
                      color: "var(--text-muted)",
                      lineHeight: "1.6",
                      margin: "0",
                    }}
                  >
                    {modularLesson.description}
                  </p>
                )}
              </div>

              <div
                className="glass-card"
                style={{
                  padding: "1rem 1.5rem",
                  background: "var(--glass-bg-hover)",
                  minWidth: "250px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      background: "var(--primary-green)",
                      color: "white",
                      padding: "4px 12px",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    ✨ MODULAR
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "var(--text-primary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  ~{modularLesson.estimatedDurationMinutes}min
                </div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                  }}
                >
                  Estimated Duration
                </div>
              </div>
            </div>
          </header>
        </div>

        {/* Section Navigation */}
        <div className="glass-card" style={{ marginBottom: "2rem" }}>
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            🧩 Lesson Sections
          </h3>
          <nav className="lesson-navigation">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "0.75rem",
              }}
            >
              {sections.map((section) => {
                const sectionBlocks = modularLesson.sections[section];
                const hasBlocks = sectionBlocks && sectionBlocks.length > 0;

                if (!hasBlocks) return null;

                const getSectionIcon = (sectionName: string) => {
                  const icons: Record<string, string> = {
                    introduction: "🚀",
                    content: "📚",
                    practice: "🔧",
                    assessment: "📝",
                    closure: "✨",
                  };
                  return icons[sectionName] || "📄";
                };

                return (
                  <button
                    key={section}
                    className={`section-nav-btn ${currentSection === section ? "active" : ""}`}
                    onClick={() => setCurrentSection(section)}
                    style={{
                      padding: "0.75rem 1rem",
                      border:
                        currentSection === section
                          ? "2px solid var(--primary-green)"
                          : "1px solid var(--glass-border)",
                      background:
                        currentSection === section
                          ? "var(--primary-green)"
                          : "var(--glass-bg-hover)",
                      color:
                        currentSection === section
                          ? "white"
                          : "var(--text-primary)",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                      textAlign: "center",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                    }}
                    onMouseEnter={(e) => {
                      if (currentSection !== section) {
                        e.currentTarget.style.background =
                          "var(--glass-bg-active)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "var(--shadow-glass)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentSection !== section) {
                        e.currentTarget.style.background =
                          "var(--glass-bg-hover)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    <span style={{ fontSize: "1.5rem" }}>
                      {getSectionIcon(section)}
                    </span>
                    <div>
                      <div style={{ fontWeight: "600" }}>
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          opacity: 0.8,
                          marginTop: "0.25rem",
                        }}
                      >
                        {sectionBlocks.length} blocks
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Lesson Content */}
        <div className="glass-card">
          <main
            className="lesson-content"
            style={{
              background: "transparent",
              border: "none",
              boxShadow: "none",
              padding: 0,
            }}
          >
            <div className={`lesson-section section-${currentSection}`}>
              <h2
                style={{
                  marginBottom: "1.5rem",
                  color: "var(--text-primary)",
                  fontSize: "1.8rem",
                  fontWeight: "600",
                }}
              >
                {currentSection.charAt(0).toUpperCase() +
                  currentSection.slice(1)}
              </h2>

              {currentSectionBlocks.length > 0 ? (
                currentSectionBlocks.map((block, index) => (
                  <ContentBlockRenderer key={block.id} block={block} />
                ))
              ) : (
                <div
                  className="glass-card"
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    background: "var(--glass-bg-hover)",
                    border: "2px dashed var(--glass-border)",
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                    📋
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
                    No content blocks in this section yet.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Navigation Footer */}
        <div
          className="glass-card"
          style={{
            textAlign: "center",
            marginTop: "2rem",
            background: "var(--glass-bg-hover)",
          }}
        >
          <Link
            to="/"
            className="btn btn-outline"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            🏠 Back to Home
          </Link>
        </div>
      </div>
    );
  };

  // Render legacy lesson
  const renderLegacyLesson = (legacyLesson: LegacyLesson) => {
    return (
      <div>
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>›</span>
          <span>Lesson</span>
        </div>

        <div className="lesson-content">
          <h1>{legacyLesson.name}</h1>

          <div
            style={{
              marginBottom: "2rem",
              padding: "1rem",
              background: "#fff3cd",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #ffeaa7",
            }}
          >
            <div>
              <strong>Type:</strong> {legacyLesson.lesson_type}
              <span
                style={{
                  marginLeft: "10px",
                  background: "#ffc107",
                  color: "#333",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "0.75rem",
                  fontWeight: "bold",
                }}
              >
                LEGACY
              </span>
            </div>
            <div>
              <strong>Duration:</strong> ~
              {legacyLesson.estimated_duration_minutes} minutes
            </div>
          </div>

          {legacyLesson.description && (
            <div
              style={{
                marginBottom: "2rem",
                fontStyle: "italic",
                color: "#666",
              }}
            >
              {legacyLesson.description}
            </div>
          )}

          {renderLessonContent(legacyLesson.content)}
        </div>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <Link
            to="/"
            className="button"
            style={{
              padding: "0.75rem 1.5rem",
              background: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "4px",
              display: "inline-block",
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div>
      {lesson?.type === "modular"
        ? renderModularLesson(lesson)
        : renderLegacyLesson(lesson as LegacyLesson)}
    </div>
  );
};

export default LessonPage;
