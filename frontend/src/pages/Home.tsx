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
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🎯</div>
            <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>
              {categories.length}
            </div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
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
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📚</div>
            <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>
              12+
            </div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
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
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚡</div>
            <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>
              Modern
            </div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
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
            gap: "0.5rem",
          }}
        >
          🗂️ Learning Categories
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
              style={{ textDecoration: "none" }}
            >
              🤖 Start with AI
            </Link>
            <button className="btn btn-outline">📋 View All Lessons</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
