import express from "express";
import { Pool } from "pg";
import Joi from "joi";

const router = express.Router();

// Validation schemas
const eventSchema = Joi.object({
  type: Joi.string()
    .valid(
      "lesson_start",
      "lesson_complete",
      "lesson_pause",
      "content_interaction",
      "feedback_submit",
    )
    .required(),
  lessonId: Joi.string().required(),
  userId: Joi.string().optional(),
  timestamp: Joi.number().required(),
  sessionId: Joi.string().required(),
  metadata: Joi.object().optional(),
});

const sessionSchema = Joi.object({
  sessionId: Joi.string().required(),
  userId: Joi.string().optional(),
  startTime: Joi.number().required(),
  endTime: Joi.number().optional(),
  lessonId: Joi.string().required(),
  events: Joi.array().items(eventSchema),
  totalTimeSpent: Joi.number().required(),
  completionRate: Joi.number().min(0).max(100).required(),
});

const feedbackSchema = Joi.object({
  lessonId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  difficulty: Joi.number().min(1).max(5).required(),
  clarity: Joi.number().min(1).max(5).required(),
  engagement: Joi.number().min(1).max(5).required(),
  comments: Joi.string().allow("").optional(),
  timeSpent: Joi.number().required(),
  userId: Joi.string().optional(),
});

// Middleware to inject database pool
router.use((req: any, res, next) => {
  req.db = req.app.locals.db; // Database pool should be attached to app.locals
  next();
});

// POST /api/analytics/events - Track individual learning events
router.post("/events", async (req: any, res) => {
  try {
    const { error, value } = eventSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: error.details[0]?.message || "Validation error" });
    }

    const { type, lessonId, userId, timestamp, sessionId, metadata } = value;

    await req.db.query(
      `
      INSERT INTO analytics_events (type, lesson_id, user_id, timestamp, session_id, metadata)
      VALUES ($1, $2, $3, $4, $5, $6)
    `,
      [
        type,
        lessonId,
        userId,
        new Date(timestamp),
        sessionId,
        JSON.stringify(metadata || {}),
      ],
    );

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error saving analytics event:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/analytics/sessions - Track complete learning sessions
router.post("/sessions", async (req: any, res) => {
  try {
    const { error, value } = sessionSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: error.details[0]?.message || "Validation error" });
    }

    const {
      sessionId,
      userId,
      startTime,
      endTime,
      lessonId,
      totalTimeSpent,
      completionRate,
    } = value;

    await req.db.query(
      `
      INSERT INTO analytics_sessions (session_id, user_id, start_time, end_time, lesson_id, total_time_spent, completion_rate)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (session_id) DO UPDATE SET
        end_time = EXCLUDED.end_time,
        total_time_spent = EXCLUDED.total_time_spent,
        completion_rate = EXCLUDED.completion_rate
    `,
      [
        sessionId,
        userId,
        new Date(startTime),
        endTime ? new Date(endTime) : null,
        lessonId,
        totalTimeSpent,
        completionRate,
      ],
    );

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error saving analytics session:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/feedback - Submit lesson feedback
router.post("/feedback", async (req: any, res) => {
  try {
    const { error, value } = feedbackSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: error.details[0]?.message || "Validation error" });
    }

    const {
      lessonId,
      rating,
      difficulty,
      clarity,
      engagement,
      comments,
      timeSpent,
      userId,
    } = value;

    await req.db.query(
      `
      INSERT INTO lesson_feedback (lesson_id, user_id, rating, difficulty, clarity, engagement, comments, time_spent, submitted_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    `,
      [
        lessonId,
        userId,
        rating,
        difficulty,
        clarity,
        engagement,
        comments,
        timeSpent,
      ],
    );

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error saving feedback:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/analytics/lessons/:lessonId/metrics - Get metrics for a specific lesson
router.get("/lessons/:lessonId/metrics", async (req: any, res) => {
  try {
    const { lessonId } = req.params;

    // Get session metrics
    const sessionMetrics = await req.db.query(
      `
      SELECT
        COUNT(*) as total_sessions,
        AVG(total_time_spent) as avg_time_spent,
        AVG(completion_rate) as avg_completion_rate,
        COUNT(CASE WHEN completion_rate >= 80 THEN 1 END) as completed_sessions
      FROM analytics_sessions
      WHERE lesson_id = $1
    `,
      [lessonId],
    );

    // Get feedback metrics
    const feedbackMetrics = await req.db.query(
      `
      SELECT
        COUNT(*) as total_feedback,
        AVG(rating) as avg_rating,
        AVG(difficulty) as avg_difficulty,
        AVG(clarity) as avg_clarity,
        AVG(engagement) as avg_engagement
      FROM lesson_feedback
      WHERE lesson_id = $1
    `,
      [lessonId],
    );

    // Get event counts
    const eventMetrics = await req.db.query(
      `
      SELECT
        type,
        COUNT(*) as count
      FROM analytics_events
      WHERE lesson_id = $1
      GROUP BY type
    `,
      [lessonId],
    );

    const metrics = {
      lessonId,
      sessions: sessionMetrics.rows[0],
      feedback: feedbackMetrics.rows[0],
      events: eventMetrics.rows.reduce((acc: any, row: any) => {
        acc[row.type] = parseInt(row.count);
        return acc;
      }, {}),
      effectiveness: {
        completionRate:
          parseFloat(sessionMetrics.rows[0].avg_completion_rate) || 0,
        userSatisfaction: parseFloat(feedbackMetrics.rows[0].avg_rating) || 0,
        contentClarity: parseFloat(feedbackMetrics.rows[0].avg_clarity) || 0,
        engagementLevel:
          parseFloat(feedbackMetrics.rows[0].avg_engagement) || 0,
      },
    };

    res.json(metrics);
  } catch (error) {
    console.error("Error fetching lesson metrics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/analytics/dashboard - Get overall platform metrics
router.get("/dashboard", async (req: any, res) => {
  try {
    // Overall platform metrics
    const platformMetrics = await req.db.query(`
      SELECT
        COUNT(DISTINCT session_id) as total_sessions,
        COUNT(DISTINCT user_id) as unique_users,
        AVG(total_time_spent) as avg_session_duration,
        AVG(completion_rate) as avg_completion_rate
      FROM analytics_sessions
      WHERE start_time > NOW() - INTERVAL '30 days'
    `);

    // Most popular lessons
    const popularLessons = await req.db.query(`
      SELECT
        l.id,
        l.name,
        COUNT(s.session_id) as session_count,
        AVG(s.completion_rate) as avg_completion_rate,
        AVG(f.rating) as avg_rating
      FROM lessons l
      LEFT JOIN analytics_sessions s ON l.id = s.lesson_id
      LEFT JOIN lesson_feedback f ON l.id = f.lesson_id
      WHERE s.start_time > NOW() - INTERVAL '30 days'
      GROUP BY l.id, l.name
      ORDER BY session_count DESC
      LIMIT 10
    `);

    // User engagement trends (last 7 days)
    const engagementTrends = await req.db.query(`
      SELECT
        DATE(start_time) as date,
        COUNT(session_id) as sessions,
        AVG(total_time_spent) as avg_duration,
        AVG(completion_rate) as avg_completion
      FROM analytics_sessions
      WHERE start_time > NOW() - INTERVAL '7 days'
      GROUP BY DATE(start_time)
      ORDER BY date
    `);

    const dashboard = {
      overview: platformMetrics.rows[0],
      popularLessons: popularLessons.rows,
      engagementTrends: engagementTrends.rows,
    };

    res.json(dashboard);
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/analytics/lessons/:lessonId/feedback - Get feedback for a lesson
router.get("/lessons/:lessonId/feedback", async (req: any, res) => {
  try {
    const { lessonId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const feedback = await req.db.query(
      `
      SELECT
        rating,
        difficulty,
        clarity,
        engagement,
        comments,
        time_spent,
        submitted_at
      FROM lesson_feedback
      WHERE lesson_id = $1 AND comments IS NOT NULL AND comments != ''
      ORDER BY submitted_at DESC
      LIMIT $2 OFFSET $3
    `,
      [lessonId, limit, offset],
    );

    const total = await req.db.query(
      `
      SELECT COUNT(*) as total
      FROM lesson_feedback
      WHERE lesson_id = $1 AND comments IS NOT NULL AND comments != ''
    `,
      [lessonId],
    );

    res.json({
      feedback: feedback.rows,
      pagination: {
        page,
        limit,
        total: parseInt(total.rows[0].total),
        pages: Math.ceil(parseInt(total.rows[0].total) / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
