-- Modular Lesson Architecture Database Schema
-- Replaces monolithic lesson content with scalable, reusable content blocks

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CONTENT BLOCKS (Atomic Content Units)
-- ============================================================================

-- Content block types enumeration
CREATE TYPE block_type AS ENUM (
    'text',           -- Rich text content
    'video',          -- Video content with metadata
    'code',           -- Code examples and demonstrations
    'quiz',           -- Quiz questions and answers
    'exercise',       -- Interactive coding exercises
    'interactive',    -- Interactive elements (simulations, tools)
    'assessment',     -- Formal assessments and evaluations
    'resource',       -- External resources and links
    'media',          -- Images, diagrams, audio
    'discussion'      -- Discussion prompts and forums
);

-- Content difficulty levels
CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

-- Main content blocks table
CREATE TABLE content_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type block_type NOT NULL,
    difficulty difficulty_level DEFAULT 'beginner',

    -- Content storage (type-specific JSON structure)
    content JSONB NOT NULL DEFAULT '{}',

    -- Metadata
    estimated_time_minutes INTEGER DEFAULT 5,
    tags TEXT[] DEFAULT '{}',
    keywords TEXT[] DEFAULT '{}',

    -- Reusability settings
    is_reusable BOOLEAN DEFAULT true,
    is_template BOOLEAN DEFAULT false,
    template_category VARCHAR(100),

    -- Versioning
    version VARCHAR(20) DEFAULT '1.0.0',
    parent_block_id UUID REFERENCES content_blocks(id),

    -- Authorship
    created_by UUID, -- References users(id) when auth is implemented
    organization VARCHAR(100),

    -- Status
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    is_active BOOLEAN DEFAULT true,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE
);

-- ============================================================================
-- BLOCK CONTENT SCHEMAS (Type-specific structures)
-- ============================================================================

-- Text block content schema example:
-- {
--   "format": "markdown|html",
--   "content": "...",
--   "images": [{"url": "...", "alt": "...", "caption": "..."}],
--   "callouts": [{"type": "info|warning|tip", "content": "..."}]
-- }

-- Video block content schema example:
-- {
--   "video_url": "...",
--   "thumbnail_url": "...",
--   "duration_seconds": 180,
--   "chapters": [{"title": "...", "start_time": 0}],
--   "subtitles": [{"lang": "en", "url": "..."}],
--   "quality_options": ["720p", "1080p"]
-- }

-- Code block content schema example:
-- {
--   "language": "javascript",
--   "code": "...",
--   "explanation": "...",
--   "runnable": true,
--   "expected_output": "...",
--   "setup_code": "...",
--   "test_cases": [{"input": "...", "expected": "..."}]
-- }

-- ============================================================================
-- LESSON STRUCTURE (Block Composition)
-- ============================================================================

-- Lessons table (simplified - content moved to blocks)
CREATE TABLE lessons_v2 (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) NOT NULL,

    -- Lesson metadata (non-content)
    lesson_type VARCHAR(50) DEFAULT 'reading',
    skill_level difficulty_level DEFAULT 'beginner',
    estimated_duration_minutes INTEGER DEFAULT 15,

    -- Learning objectives and prerequisites
    learning_objectives TEXT[] DEFAULT '{}',
    prerequisites TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',

    -- Structure settings
    allow_navigation BOOLEAN DEFAULT true,
    require_sequential BOOLEAN DEFAULT false,

    -- Status
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(topic_id, slug)
);

-- Lesson-block relationships (composition)
CREATE TABLE lesson_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons_v2(id) ON DELETE CASCADE,
    block_id UUID NOT NULL REFERENCES content_blocks(id) ON DELETE CASCADE,

    -- Ordering and structure
    section VARCHAR(100), -- 'introduction', 'content', 'practice', 'assessment', 'closure'
    order_index INTEGER NOT NULL DEFAULT 0,

    -- Block customization for this lesson
    custom_title VARCHAR(255),
    custom_instructions TEXT,
    custom_metadata JSONB DEFAULT '{}',

    -- Conditional display
    display_conditions JSONB DEFAULT '{}',
    required BOOLEAN DEFAULT true,

    -- Progress tracking
    estimated_time_override INTEGER,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(lesson_id, block_id, section, order_index)
);

-- ============================================================================
-- BLOCK RELATIONSHIPS (Dependencies and Flows)
-- ============================================================================

-- Block dependencies (prerequisites between blocks)
CREATE TABLE block_dependencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dependent_block_id UUID NOT NULL REFERENCES content_blocks(id) ON DELETE CASCADE,
    prerequisite_block_id UUID NOT NULL REFERENCES content_blocks(id) ON DELETE CASCADE,
    dependency_type VARCHAR(50) DEFAULT 'prerequisite', -- 'prerequisite', 'recommended', 'alternative'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(dependent_block_id, prerequisite_block_id)
);

-- Block transitions (navigation rules)
CREATE TABLE block_transitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_block_id UUID NOT NULL REFERENCES content_blocks(id) ON DELETE CASCADE,
    to_block_id UUID NOT NULL REFERENCES content_blocks(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons_v2(id) ON DELETE CASCADE,

    -- Transition conditions
    condition_type VARCHAR(50) DEFAULT 'completion', -- 'completion', 'score', 'choice', 'time'
    condition_value JSONB DEFAULT '{}',

    -- Transition behavior
    is_automatic BOOLEAN DEFAULT true,
    delay_seconds INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(lesson_id, from_block_id, to_block_id)
);

-- ============================================================================
-- USER PROGRESS (Granular Block-level Tracking)
-- ============================================================================

-- User progress on individual blocks
CREATE TABLE user_block_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    block_id UUID NOT NULL REFERENCES content_blocks(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons_v2(id) ON DELETE CASCADE, -- Context

    -- Progress tracking
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),

    -- Time tracking
    time_spent_seconds INTEGER DEFAULT 0,
    first_accessed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- Block-specific progress data
    progress_data JSONB DEFAULT '{}', -- Quiz answers, code submissions, etc.

    -- Scoring (for assessments)
    score DECIMAL(5,2),
    max_score DECIMAL(5,2),
    attempts INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, block_id, lesson_id)
);

-- ============================================================================
-- CONTENT TEMPLATES AND LIBRARIES
-- ============================================================================

-- Template collections
CREATE TABLE template_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),

    -- Collection metadata
    skill_level difficulty_level,
    subject_area VARCHAR(100),
    suitable_for TEXT[], -- 'programming', 'design', 'business', etc.

    -- Usage stats
    usage_count INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,

    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Template-block relationships
CREATE TABLE template_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES template_collections(id) ON DELETE CASCADE,
    block_id UUID NOT NULL REFERENCES content_blocks(id) ON DELETE CASCADE,

    order_index INTEGER DEFAULT 0,
    section VARCHAR(100),
    is_optional BOOLEAN DEFAULT false,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(template_id, block_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Content blocks indexes
CREATE INDEX idx_content_blocks_type ON content_blocks(type);
CREATE INDEX idx_content_blocks_difficulty ON content_blocks(difficulty);
CREATE INDEX idx_content_blocks_reusable ON content_blocks(is_reusable);
CREATE INDEX idx_content_blocks_template ON content_blocks(is_template);
CREATE INDEX idx_content_blocks_status ON content_blocks(status);
CREATE INDEX idx_content_blocks_tags ON content_blocks USING GIN(tags);
CREATE INDEX idx_content_blocks_keywords ON content_blocks USING GIN(keywords);

-- Lesson blocks indexes
CREATE INDEX idx_lesson_blocks_lesson_id ON lesson_blocks(lesson_id);
CREATE INDEX idx_lesson_blocks_block_id ON lesson_blocks(block_id);
CREATE INDEX idx_lesson_blocks_section ON lesson_blocks(section);
CREATE INDEX idx_lesson_blocks_order ON lesson_blocks(order_index);

-- User progress indexes
CREATE INDEX idx_user_block_progress_user_id ON user_block_progress(user_id);
CREATE INDEX idx_user_block_progress_block_id ON user_block_progress(block_id);
CREATE INDEX idx_user_block_progress_lesson_id ON user_block_progress(lesson_id);
CREATE INDEX idx_user_block_progress_status ON user_block_progress(status);

-- Dependency and transition indexes
CREATE INDEX idx_block_dependencies_dependent ON block_dependencies(dependent_block_id);
CREATE INDEX idx_block_dependencies_prerequisite ON block_dependencies(prerequisite_block_id);
CREATE INDEX idx_block_transitions_lesson_id ON block_transitions(lesson_id);

-- ============================================================================
-- TRIGGERS FOR MAINTENANCE
-- ============================================================================

-- Update timestamps trigger function (reuse existing)
CREATE TRIGGER update_content_blocks_updated_at
    BEFORE UPDATE ON content_blocks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_v2_updated_at
    BEFORE UPDATE ON lessons_v2
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_blocks_updated_at
    BEFORE UPDATE ON lesson_blocks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_block_progress_updated_at
    BEFORE UPDATE ON user_block_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- Complete lesson structure view
CREATE VIEW lesson_structure_view AS
SELECT
    l.id as lesson_id,
    l.name as lesson_name,
    l.slug,
    lb.section,
    lb.order_index,
    cb.id as block_id,
    cb.title as block_title,
    cb.type as block_type,
    cb.difficulty,
    cb.estimated_time_minutes,
    COALESCE(lb.estimated_time_override, cb.estimated_time_minutes) as effective_time,
    cb.content,
    lb.custom_title,
    lb.custom_instructions,
    lb.required
FROM lessons_v2 l
JOIN lesson_blocks lb ON l.id = lb.lesson_id
JOIN content_blocks cb ON lb.block_id = cb.id
WHERE l.is_active = true AND cb.is_active = true
ORDER BY l.id, lb.section, lb.order_index;

-- User lesson progress summary view
CREATE VIEW user_lesson_progress_view AS
SELECT
    ubp.user_id,
    ubp.lesson_id,
    l.name as lesson_name,
    COUNT(ubp.block_id) as total_blocks,
    COUNT(CASE WHEN ubp.status = 'completed' THEN 1 END) as completed_blocks,
    ROUND(
        (COUNT(CASE WHEN ubp.status = 'completed' THEN 1 END)::decimal / COUNT(ubp.block_id)) * 100,
        2
    ) as completion_percentage,
    SUM(ubp.time_spent_seconds) as total_time_seconds,
    MAX(ubp.last_accessed_at) as last_accessed
FROM user_block_progress ubp
JOIN lessons_v2 l ON ubp.lesson_id = l.id
GROUP BY ubp.user_id, ubp.lesson_id, l.name;

-- Reusable blocks library view
CREATE VIEW reusable_blocks_view AS
SELECT
    cb.id,
    cb.title,
    cb.description,
    cb.type,
    cb.difficulty,
    cb.estimated_time_minutes,
    cb.tags,
    cb.template_category,
    COUNT(lb.lesson_id) as usage_count,
    cb.created_at,
    cb.updated_at
FROM content_blocks cb
LEFT JOIN lesson_blocks lb ON cb.id = lb.block_id
WHERE cb.is_reusable = true AND cb.is_active = true
GROUP BY cb.id, cb.title, cb.description, cb.type, cb.difficulty,
         cb.estimated_time_minutes, cb.tags, cb.template_category,
         cb.created_at, cb.updated_at
ORDER BY usage_count DESC, cb.updated_at DESC;