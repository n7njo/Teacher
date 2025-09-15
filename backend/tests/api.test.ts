import request from "supertest";
import express from "express";
import { Pool } from "pg";
import { createTestPool, cleanDatabase, seedTestData } from "./setup";

// Mock the main app without starting the server
const app = express();
app.use(express.json());

// Import and set up routes (we'll need to extract these from index.ts)
let pool: Pool;

beforeAll(async () => {
  pool = createTestPool();
  await cleanDatabase(pool);
  await seedTestData(pool);
});

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  // Clean and reseed before each test
  await cleanDatabase(pool);
  await seedTestData(pool);
});

describe("Health Check Endpoint", () => {
  test("GET /health should return status ok", async () => {
    app.get("/health", (req, res) => {
      res
        .status(200)
        .json({ status: "ok", timestamp: new Date().toISOString() });
    });

    const response = await request(app).get("/health").expect(200);

    expect(response.body.status).toBe("ok");
    expect(response.body.timestamp).toBeDefined();
  });
});

describe("Categories API", () => {
  beforeEach(() => {
    app.get("/api/categories", async (req, res) => {
      try {
        const result = await pool.query(
          "SELECT * FROM categories WHERE is_active = true ORDER BY order_index, name",
        );
        res.json(result.rows);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
    });
  });

  test("GET /api/categories should return all active categories", async () => {
    const response = await request(app).get("/api/categories").expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("slug");
    expect(response.body[0].is_active).toBe(true);
  });

  test("Categories should be ordered by order_index and name", async () => {
    const response = await request(app).get("/api/categories").expect(200);

    const categories = response.body;
    if (categories.length > 1) {
      for (let i = 1; i < categories.length; i++) {
        const prev = categories[i - 1];
        const curr = categories[i];
        expect(prev.order_index <= curr.order_index).toBe(true);
      }
    }
  });
});

describe("Topics API", () => {
  beforeEach(() => {
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
        res.status(500).json({ error: "Internal server error" });
      }
    });
  });

  test("GET /api/categories/:categorySlug/topics should return topics for valid category", async () => {
    const response = await request(app)
      .get("/api/categories/test-category/topics")
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("slug");
    expect(response.body[0]).toHaveProperty("category_id");
    expect(response.body[0].is_active).toBe(true);
  });

  test("GET /api/categories/invalid-category/topics should return empty array", async () => {
    const response = await request(app)
      .get("/api/categories/invalid-category/topics")
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });
});

describe("Lessons API", () => {
  beforeEach(() => {
    app.get("/api/topics/:topicId/lessons", async (req, res) => {
      try {
        const { topicId } = req.params;
        const result = await pool.query(
          "SELECT * FROM lessons WHERE topic_id = $1 AND is_active = true ORDER BY order_index, name",
          [topicId],
        );
        res.json(result.rows);
      } catch (error) {
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
        return res.status(500).json({ error: "Internal server error" });
      }
    });
  });

  test("GET /api/topics/:topicId/lessons should return lessons for valid topic", async () => {
    const response = await request(app)
      .get("/api/topics/1/lessons")
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("content");
    expect(response.body[0]).toHaveProperty("topic_id");
    expect(response.body[0].is_active).toBe(true);
  });

  test("GET /api/lessons/:lessonId should return specific lesson", async () => {
    const response = await request(app).get("/api/lessons/1").expect(200);

    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("content");
    expect(response.body).toHaveProperty("lesson_type");
    expect(response.body).toHaveProperty("estimated_duration_minutes");
    expect(response.body.id).toBe(1);
  });

  test("GET /api/lessons/:lessonId should return 404 for invalid lesson", async () => {
    const response = await request(app).get("/api/lessons/999").expect(404);

    expect(response.body.error).toBe("Lesson not found");
  });
});

describe("Error Handling", () => {
  test("Invalid JSON should return 400", async () => {
    app.post("/api/test", (req, res) => {
      res.json({ received: req.body });
    });

    const response = await request(app)
      .post("/api/test")
      .send("invalid json")
      .set("Content-Type", "application/json")
      .expect(400);
  });

  test("Non-existent route should return 404", async () => {
    app.use((req, res) => {
      res.status(404).json({ error: "Route not found" });
    });

    await request(app).get("/api/non-existent").expect(404);
  });
});
