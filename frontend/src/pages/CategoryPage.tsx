import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

interface Topic {
  id: string;
  name: string;
  description: string;
  slug: string;
  estimated_duration_minutes: number;
  difficulty_level: string;
}

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      if (!categorySlug) return;

      try {
        const response = await axios.get(
          `/api/categories/${categorySlug}/topics`,
        );
        setTopics(response.data);
      } catch (err) {
        setError("Failed to load topics. Please try again later.");
        console.error("Error fetching topics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [categorySlug]);

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "#28a745";
      case "intermediate":
        return "#ffc107";
      case "advanced":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  if (loading) {
    return <div className="loading">Loading topics...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div>
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>›</span>
        <span>{categorySlug}</span>
      </div>

      <h1
        style={{
          color: "white",
          marginBottom: "2rem",
          textTransform: "capitalize",
        }}
      >
        {categorySlug?.replace("-", " ")} Topics
      </h1>

      <div className="grid">
        {topics.map((topic) => (
          <Link
            key={topic.id}
            to={`/category/${categorySlug}/topic/${topic.slug}`}
            style={{ textDecoration: "none" }}
          >
            <div className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                }}
              >
                <h3 style={{ margin: 0, flex: 1 }}>{topic.name}</h3>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "0.5rem",
                  }}
                >
                  <span
                    style={{
                      background: getDifficultyColor(topic.difficulty_level),
                      color: "white",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "12px",
                      fontSize: "0.8rem",
                      textTransform: "capitalize",
                    }}
                  >
                    {topic.difficulty_level}
                  </span>
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 0.6)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {formatDuration(topic.estimated_duration_minutes)}
                  </span>
                </div>
              </div>
              <p>{topic.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {topics.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <h2 style={{ color: "rgba(255, 255, 255, 0.7)" }}>
            No topics available yet
          </h2>
          <p style={{ color: "rgba(255, 255, 255, 0.5)" }}>
            Check back soon for new learning content in this category!
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
