"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const pg_1 = require("pg");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const pool = new pg_1.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)("combined"));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
app.locals.db = pool;
const analytics_1 = __importDefault(require("./routes/analytics"));
app.use("/api/analytics", analytics_1.default);
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
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
  return;
});
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  pool.end(() => {
    process.exit(0);
  });
});
//# sourceMappingURL=index.js.map
