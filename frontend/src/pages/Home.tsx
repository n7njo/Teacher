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
    <div>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "white" }}>
          Welcome to SkillForge
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "rgba(255, 255, 255, 0.8)",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Navigate your learning journey with structured paths designed to build
          your skills step by step.
        </p>
      </div>

      <div className="grid">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            style={{ textDecoration: "none" }}
          >
            <div className="card">
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                {category.icon || "📚"}
              </div>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {categories.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <h2 style={{ color: "rgba(255, 255, 255, 0.7)" }}>
            No categories available yet
          </h2>
          <p style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            Check back soon for new learning content!
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
