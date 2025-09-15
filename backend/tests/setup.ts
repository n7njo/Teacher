import { Pool } from "pg";

// Global test configuration
beforeAll(async () => {
  // Set test environment
  process.env.NODE_ENV = "test";
  process.env.DATABASE_URL =
    process.env.TEST_DATABASE_URL ||
    "postgresql://skillforge_user:skillforge_password@localhost:5433/skillforge_learning_test";
});

afterAll(async () => {
  // Clean up any global resources
});

// Global error handler for unhandled promises
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Helper function to create test database connection
export const createTestPool = () => {
  return new Pool({
    connectionString:
      process.env.TEST_DATABASE_URL ||
      "postgresql://skillforge_user:skillforge_password@localhost:5433/skillforge_learning_test",
    ssl: false,
  });
};

// Helper function to clean database between tests
export const cleanDatabase = async (pool: Pool) => {
  await pool.query(
    "TRUNCATE lessons, topics, categories RESTART IDENTITY CASCADE",
  );
};

// Helper function to seed test data
export const seedTestData = async (pool: Pool) => {
  // Insert test categories
  await pool.query(`
    INSERT INTO categories (id, name, slug, description, is_active, order_index) VALUES
    (1, 'Test Category', 'test-category', 'A test category', true, 1)
  `);

  // Insert test topics
  await pool.query(`
    INSERT INTO topics (id, name, slug, description, category_id, is_active, order_index) VALUES
    (1, 'Test Topic', 'test-topic', 'A test topic', 1, true, 1)
  `);

  // Insert test lessons
  await pool.query(`
    INSERT INTO lessons (id, name, description, content, topic_id, lesson_type, estimated_duration_minutes, is_active, order_index) VALUES
    (1, 'Test Lesson', 'A test lesson', '{"html": "<h1>Test Content</h1>"}', 1, 'interactive', 30, true, 1)
  `);
};
