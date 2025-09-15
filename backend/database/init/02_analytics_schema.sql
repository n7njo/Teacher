-- Analytics and feedback tables for testing and validation

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    lesson_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    timestamp TIMESTAMP NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for analytics events
CREATE INDEX IF NOT EXISTS idx_analytics_events_lesson_id ON analytics_events(lesson_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(type);

-- Analytics sessions table
CREATE TABLE IF NOT EXISTS analytics_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id VARCHAR(255),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    lesson_id VARCHAR(255) NOT NULL,
    total_time_spent INTEGER NOT NULL DEFAULT 0, -- in milliseconds
    completion_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00, -- percentage 0-100
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for analytics sessions
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_lesson_id ON analytics_sessions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_user_id ON analytics_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_start_time ON analytics_sessions(start_time);

-- Lesson feedback table
CREATE TABLE IF NOT EXISTS lesson_feedback (
    id SERIAL PRIMARY KEY,
    lesson_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    difficulty INTEGER NOT NULL CHECK (difficulty >= 1 AND difficulty <= 5),
    clarity INTEGER NOT NULL CHECK (clarity >= 1 AND clarity <= 5),
    engagement INTEGER NOT NULL CHECK (engagement >= 1 AND engagement <= 5),
    comments TEXT,
    time_spent INTEGER NOT NULL DEFAULT 0, -- in milliseconds
    submitted_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for lesson feedback
CREATE INDEX IF NOT EXISTS idx_lesson_feedback_lesson_id ON lesson_feedback(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_feedback_user_id ON lesson_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_feedback_submitted_at ON lesson_feedback(submitted_at);
CREATE INDEX IF NOT EXISTS idx_lesson_feedback_rating ON lesson_feedback(rating);

-- A/B testing experiments table
CREATE TABLE IF NOT EXISTS ab_test_experiments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft', -- draft, active, paused, completed
    start_date DATE,
    end_date DATE,
    traffic_allocation DECIMAL(3,2) DEFAULT 1.00, -- percentage 0-1
    success_metrics JSONB DEFAULT '[]',
    variants JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- A/B testing assignments table
CREATE TABLE IF NOT EXISTS ab_test_assignments (
    id SERIAL PRIMARY KEY,
    experiment_id INTEGER REFERENCES ab_test_experiments(id),
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    variant VARCHAR(50) NOT NULL,
    assigned_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for A/B testing
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_experiment_id ON ab_test_assignments(experiment_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_user_id ON ab_test_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_session_id ON ab_test_assignments(session_id);

-- Content quality metrics table
CREATE TABLE IF NOT EXISTS content_quality_metrics (
    id SERIAL PRIMARY KEY,
    lesson_id VARCHAR(255) NOT NULL,
    metric_type VARCHAR(100) NOT NULL, -- accuracy, clarity, engagement, structure, relevance
    score DECIMAL(4,2) NOT NULL, -- 0-100 scale
    reviewer_id VARCHAR(255),
    review_date TIMESTAMP DEFAULT NOW(),
    comments TEXT,
    version INTEGER DEFAULT 1
);

-- Create indexes for content quality metrics
CREATE INDEX IF NOT EXISTS idx_content_quality_lesson_id ON content_quality_metrics(lesson_id);
CREATE INDEX IF NOT EXISTS idx_content_quality_metric_type ON content_quality_metrics(metric_type);
CREATE INDEX IF NOT EXISTS idx_content_quality_review_date ON content_quality_metrics(review_date);

-- User learning paths and progress
CREATE TABLE IF NOT EXISTS user_learning_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    lesson_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'not_started', -- not_started, in_progress, completed, failed
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    attempts INTEGER DEFAULT 0,
    best_score DECIMAL(5,2) DEFAULT 0.00,
    time_spent INTEGER DEFAULT 0, -- total time in milliseconds
    last_accessed TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Create indexes for user learning progress
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_user_id ON user_learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_lesson_id ON user_learning_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_status ON user_learning_progress(status);
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_last_accessed ON user_learning_progress(last_accessed);

-- Performance monitoring table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,4) NOT NULL,
    metric_unit VARCHAR(50), -- ms, seconds, percentage, count, etc.
    context JSONB DEFAULT '{}', -- additional context like page, feature, etc.
    recorded_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance metrics
CREATE INDEX IF NOT EXISTS idx_performance_metrics_name ON performance_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_recorded_at ON performance_metrics(recorded_at);

-- User behavior heatmaps (for UX analysis)
CREATE TABLE IF NOT EXISTS user_interaction_heatmaps (
    id SERIAL PRIMARY KEY,
    lesson_id VARCHAR(255) NOT NULL,
    page_url VARCHAR(500) NOT NULL,
    x_coordinate INTEGER NOT NULL,
    y_coordinate INTEGER NOT NULL,
    viewport_width INTEGER NOT NULL,
    viewport_height INTEGER NOT NULL,
    interaction_type VARCHAR(50) NOT NULL, -- click, scroll, hover
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Create indexes for heatmaps
CREATE INDEX IF NOT EXISTS idx_heatmaps_lesson_id ON user_interaction_heatmaps(lesson_id);
CREATE INDEX IF NOT EXISTS idx_heatmaps_page_url ON user_interaction_heatmaps(page_url);
CREATE INDEX IF NOT EXISTS idx_heatmaps_interaction_type ON user_interaction_heatmaps(interaction_type);
CREATE INDEX IF NOT EXISTS idx_heatmaps_timestamp ON user_interaction_heatmaps(timestamp);

-- Views for analytics dashboards

-- Lesson effectiveness summary view
CREATE OR REPLACE VIEW lesson_effectiveness_summary AS
SELECT
    l.id,
    l.name,
    l.lesson_type,
    l.estimated_duration_minutes,
    COUNT(DISTINCT s.session_id) as total_sessions,
    COUNT(DISTINCT s.user_id) as unique_users,
    AVG(s.total_time_spent) as avg_time_spent_ms,
    AVG(s.completion_rate) as avg_completion_rate,
    COUNT(CASE WHEN s.completion_rate >= 80 THEN 1 END) as completed_sessions,
    COUNT(f.id) as feedback_count,
    AVG(f.rating) as avg_rating,
    AVG(f.difficulty) as avg_difficulty,
    AVG(f.clarity) as avg_clarity,
    AVG(f.engagement) as avg_engagement
FROM lessons l
LEFT JOIN analytics_sessions s ON l.id = s.lesson_id
LEFT JOIN lesson_feedback f ON l.id = f.lesson_id
GROUP BY l.id, l.name, l.lesson_type, l.estimated_duration_minutes;

-- Daily engagement metrics view
CREATE OR REPLACE VIEW daily_engagement_metrics AS
SELECT
    DATE(start_time) as date,
    COUNT(DISTINCT session_id) as total_sessions,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(total_time_spent) as avg_session_duration_ms,
    AVG(completion_rate) as avg_completion_rate,
    COUNT(CASE WHEN completion_rate >= 80 THEN 1 END) as successful_sessions
FROM analytics_sessions
WHERE start_time >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(start_time)
ORDER BY date;