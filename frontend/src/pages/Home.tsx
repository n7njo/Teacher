import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  icon: string;
}

const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data);
      } catch (err) {
        setError("Failed to load categories. Please try again later.");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div className="loading">Loading learning categories...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <div
        className="glass-card"
        style={{
          textAlign: "center",
          marginBottom: "3rem",
          background: "var(--glass-bg)",
          padding: "3rem 2rem",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            marginBottom: "1rem",
            background: "var(--gradient-accent)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: "700",
          }}
        >
          Welcome to SkillForge
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "var(--text-muted)",
            maxWidth: "650px",
            margin: "0 auto 2rem auto",
            lineHeight: "1.8",
          }}
        >
          Navigate your learning journey with structured paths designed to build
          your skills step by step. Start exploring our curated categories
          below.
        </p>

        {/* Quick Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "1rem",
            maxWidth: "600px",
            margin: "2rem auto 0 auto",
          }}
        >
          <div
            className="glass-card"
            style={{
              padding: "1rem",
              textAlign: "center",
              background: "var(--glass-bg-hover)",
            }}
          >
            <div style={{ marginBottom: "0.75rem" }}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--primary-green)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
            <div
              style={{
                fontWeight: "700",
                color: "var(--text-primary)",
                fontSize: "1.5rem",
              }}
            >
              {categories.length}
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                fontWeight: "500",
              }}
            >
              Categories
            </div>
          </div>
          <div
            className="glass-card"
            style={{
              padding: "1rem",
              textAlign: "center",
              background: "var(--glass-bg-hover)",
            }}
          >
            <div style={{ marginBottom: "0.75rem" }}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--primary-green)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <div
              style={{
                fontWeight: "700",
                color: "var(--text-primary)",
                fontSize: "1.5rem",
              }}
            >
              12+
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                fontWeight: "500",
              }}
            >
              Lessons
            </div>
          </div>
          <div
            className="glass-card"
            style={{
              padding: "1rem",
              textAlign: "center",
              background: "var(--glass-bg-hover)",
            }}
          >
            <div style={{ marginBottom: "0.75rem" }}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--primary-green)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>
            <div
              style={{
                fontWeight: "700",
                color: "var(--text-primary)",
                fontSize: "1.5rem",
              }}
            >
              Modern
            </div>
            <div
              style={{
                fontSize: "0.875rem",
                color: "var(--text-muted)",
                fontWeight: "500",
              }}
            >
              Approach
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div
        className="glass-card"
        style={{
          marginBottom: "2rem",
          background: "var(--glass-bg)",
        }}
      >
        <h2
          style={{
            fontSize: "1.8rem",
            color: "var(--text-primary)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontWeight: "700",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14,2 14,8 20,8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10,9 9,9 8,9"></polyline>
          </svg>
          Learning Categories
        </h2>

        <div className="grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              style={{ textDecoration: "none" }}
            >
              <div
                className="glass-card"
                style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    fontSize: "3rem",
                    marginBottom: "1rem",
                    textAlign: "center",
                    padding: "1rem",
                    background: "var(--glass-bg-hover)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "80px",
                  }}
                >
                  {category.icon || "📚"}
                </div>
                <h3
                  style={{
                    marginTop: "0",
                    marginBottom: "0.75rem",
                    fontSize: "1.4rem",
                    fontWeight: "600",
                  }}
                >
                  {category.name}
                </h3>
                <p
                  style={{
                    flex: 1,
                    marginBottom: "1rem",
                    lineHeight: "1.6",
                  }}
                >
                  {category.description}
                </p>
                <div
                  className="btn btn-outline"
                  style={{
                    alignSelf: "flex-start",
                    fontSize: "0.9rem",
                    padding: "0.5rem 1rem",
                  }}
                >
                  Explore →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div
            className="glass-card"
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              background: "var(--glass-bg-hover)",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚧</div>
            <h2
              style={{
                color: "var(--text-primary)",
                marginBottom: "1rem",
              }}
            >
              No categories available yet
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1.1rem",
              }}
            >
              We're working on adding amazing learning content. Check back soon
              for new categories and lessons!
            </p>
          </div>
        )}
      </div>

      {/* Call to Action */}
      {categories.length > 0 && (
        <div
          className="glass-card"
          style={{
            textAlign: "center",
            padding: "2rem",
            background: "var(--glass-bg-hover)",
          }}
        >
          <h3
            style={{
              fontSize: "1.4rem",
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            Ready to start learning?
          </h3>
          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: "2rem",
              fontSize: "1.1rem",
            }}
          >
            Choose a category above and begin your skill-building journey today.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/category/using-ai"
              className="btn"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <circle cx="12" cy="5" r="2"></circle>
                <path d="m12 7-3 5h6l-3-5z"></path>
              </svg>
              Start with AI
            </Link>
            <button
              className="btn btn-outline"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 6h13"></path>
                <path d="M8 12h13"></path>
                <path d="M8 18h13"></path>
                <path d="M3 6h.01"></path>
                <path d="M3 12h.01"></path>
                <path d="M3 18h.01"></path>
              </svg>
              View All Lessons
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
