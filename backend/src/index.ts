import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Database pool for route handlers
app.locals.db = pool;

// Import and use analytics routes
import analyticsRouter from "./routes/analytics";
app.use("/api/analytics", analyticsRouter);

// Import and use modular lessons routes
import modularLessonsRouter from "./routes/modular-lessons";
app.use("/api/modular", modularLessonsRouter);

// API Routes
app.get("/api/lessons", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM lessons WHERE is_active = true ORDER BY order_index, name",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/categories", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories WHERE is_active = true ORDER BY order_index, name",
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/categories/:categorySlug/topics", async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const result = await pool.query(
      `
      SELECT t.* FROM topics t
      JOIN categories c ON t.category_id = c.id
      WHERE c.slug = $1 AND t.is_active = true
      ORDER BY t.order_index, t.name
    `,
      [categorySlug],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/topics/:topicId/lessons", async (req, res) => {
  try {
    const { topicId } = req.params;
    const result = await pool.query(
      "SELECT * FROM lessons WHERE topic_id = $1 AND is_active = true ORDER BY order_index, name",
      [topicId],
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/lessons/:lessonId", async (req, res) => {
  try {
    const { lessonId } = req.params;
    const result = await pool.query("SELECT * FROM lessons WHERE id = $1", [
      lessonId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
    return;
  },
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  pool.end(() => {
    process.exit(0);
  });
});
