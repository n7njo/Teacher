# Migration Strategy: Monolithic to Modular Lesson Architecture

## 📋 Overview

This document outlines the strategy for migrating from the current monolithic lesson content storage to a scalable, modular content block system.

## 🎯 Migration Goals

1. **Zero Downtime**: Maintain service availability during migration
2. **Data Integrity**: Preserve all existing lesson content and user progress
3. **Backwards Compatibility**: Support both systems during transition
4. **Performance**: Improve lesson loading and editing performance
5. **Scalability**: Enable complex, multi-component lessons

## 🚀 Migration Phases

### Phase 1: Infrastructure Setup (Week 1)

**Objective**: Prepare new schema alongside existing system

#### Tasks:

- [ ] Deploy new modular schema tables
- [ ] Create migration utilities and scripts
- [ ] Set up dual-write capability
- [ ] Implement content block parsers

#### Technical Steps:

```sql
-- 1. Create new tables (from modular-lesson-schema.sql)
\i modular-lesson-schema.sql

-- 2. Create migration tracking table
CREATE TABLE migration_progress (
    lesson_id UUID PRIMARY KEY,
    migration_status VARCHAR(20) DEFAULT 'pending',
    migrated_blocks INTEGER DEFAULT 0,
    total_blocks INTEGER DEFAULT 0,
    migration_started_at TIMESTAMP,
    migration_completed_at TIMESTAMP,
    migration_errors JSONB DEFAULT '[]'
);
```

### Phase 2: Content Analysis & Block Identification (Week 2)

**Objective**: Analyze existing content and identify natural block boundaries

#### Content Parsing Strategy:

````typescript
// Content block detection patterns
const blockPatterns = {
  headers: /^#{1,6}\s+(.+)$/gm, // Markdown headers
  codeBlocks: /```[\s\S]*?```/g, // Code blocks
  htmlSections: /<h[1-6]>.*?<\/h[1-6]>/g, // HTML headers
  exercises: /exercise|practice|try/i, // Exercise sections
  assessments: /quiz|test|assessment/i, // Assessment sections
};

interface ContentBlock {
  type: "text" | "code" | "quiz" | "exercise";
  content: string;
  title: string;
  order: number;
}
````

#### Analysis Script:

```typescript
async function analyzeLessonContent(lessonId: string) {
  const lesson = await db.lessons.findById(lessonId);
  const content = lesson.content;

  // Detect natural boundaries
  const blocks = parseContentIntoBlocks(content);

  // Create analysis report
  return {
    lessonId,
    currentSize: JSON.stringify(content).length,
    detectedBlocks: blocks.length,
    blockTypes: blocks.map((b) => b.type),
    estimatedComplexity: calculateComplexity(blocks),
  };
}
```

### Phase 3: Dual-Write Implementation (Week 3)

**Objective**: Write to both old and new systems simultaneously

#### Service Layer Updates:

```typescript
class LessonService {
  async createLesson(lessonData: LessonInput) {
    // Write to legacy system
    const lesson = await this.legacyLessonRepo.create(lessonData);

    // Parse content into blocks
    const blocks = await this.parseContentIntoBlocks(lessonData.content);

    // Write to new modular system
    await this.createModularLesson(lesson.id, blocks);

    return lesson;
  }

  async updateLesson(lessonId: string, updates: LessonUpdate) {
    // Update legacy system
    await this.legacyLessonRepo.update(lessonId, updates);

    // Sync with modular system
    await this.syncToModularSystem(lessonId, updates);
  }
}
```

### Phase 4: Background Migration (Week 4-5)

**Objective**: Migrate existing lessons to modular system

#### Migration Worker:

```typescript
class LessonMigrationWorker {
  async migrateLessonBatch(lessonIds: string[]) {
    for (const lessonId of lessonIds) {
      try {
        await this.migrateLesson(lessonId);
        await this.updateMigrationProgress(lessonId, "completed");
      } catch (error) {
        await this.logMigrationError(lessonId, error);
        await this.updateMigrationProgress(lessonId, "failed");
      }
    }
  }

  private async migrateLesson(lessonId: string) {
    // 1. Fetch legacy lesson
    const legacyLesson = await this.fetchLegacyLesson(lessonId);

    // 2. Parse content into blocks
    const blocks = await this.parseIntoBlocks(legacyLesson.content);

    // 3. Create content blocks
    const blockIds = await this.createContentBlocks(blocks);

    // 4. Create modular lesson structure
    await this.createLessonStructure(lessonId, blockIds);

    // 5. Migrate user progress
    await this.migrateUserProgress(lessonId, blockIds);
  }
}
```

#### Progress Monitoring:

```sql
-- Migration status query
SELECT
  migration_status,
  COUNT(*) as lesson_count,
  ROUND(AVG(migrated_blocks::float / total_blocks * 100), 2) as avg_progress
FROM migration_progress
GROUP BY migration_status;
```

### Phase 5: API Dual-Read (Week 6)

**Objective**: Serve content from both systems based on migration status

#### Smart Content Delivery:

```typescript
class LessonController {
  async getLesson(lessonId: string) {
    const migrationStatus = await this.getMigrationStatus(lessonId);

    if (migrationStatus === "completed") {
      // Use modular system
      return await this.getModularLesson(lessonId);
    } else {
      // Fallback to legacy system
      return await this.getLegacyLesson(lessonId);
    }
  }

  async getModularLesson(lessonId: string) {
    // Fetch lesson structure
    const structure = await db.query(
      `
      SELECT * FROM lesson_structure_view
      WHERE lesson_id = $1
      ORDER BY section, order_index
    `,
      [lessonId],
    );

    // Build response
    return {
      id: lessonId,
      structure: this.groupBySection(structure.rows),
      metadata: await this.getLessonMetadata(lessonId),
    };
  }
}
```

### Phase 6: Frontend Migration (Week 7-8)

**Objective**: Update frontend to handle modular content

#### New Lesson Renderer:

```tsx
interface ModularLessonProps {
  lessonId: string;
}

export const ModularLessonRenderer: React.FC<ModularLessonProps> = ({
  lessonId,
}) => {
  const { data: lesson, loading } = useModularLesson(lessonId);

  if (loading) return <LessonSkeleton />;

  return (
    <div className="modular-lesson">
      {lesson.structure.introduction.map((block) => (
        <ContentBlock key={block.id} block={block} />
      ))}

      <div className="lesson-content">
        {lesson.structure.content.map((block) => (
          <ContentBlock key={block.id} block={block} />
        ))}
      </div>

      <div className="lesson-practice">
        {lesson.structure.practice.map((block) => (
          <ContentBlock key={block.id} block={block} />
        ))}
      </div>

      <div className="lesson-assessment">
        {lesson.structure.assessment.map((block) => (
          <ContentBlock key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
};
```

#### Block-specific Renderers:

```tsx
const ContentBlock: React.FC<{ block: ContentBlock }> = ({ block }) => {
  switch (block.type) {
    case "text":
      return <TextBlock content={block.content} />;
    case "video":
      return <VideoBlock content={block.content} />;
    case "code":
      return <CodeBlock content={block.content} />;
    case "quiz":
      return <QuizBlock content={block.content} />;
    case "exercise":
      return <ExerciseBlock content={block.content} />;
    default:
      return <GenericBlock content={block.content} />;
  }
};
```

### Phase 7: Progressive Enhancement (Week 9-10)

**Objective**: Enable new modular features

#### New Features:

- **Block Library**: Browse and reuse content blocks
- **Lesson Templates**: Create lessons from block templates
- **Advanced Progress**: Block-level progress tracking
- **Conditional Navigation**: Smart lesson flows

#### Block Library UI:

```tsx
export const BlockLibrary: React.FC = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [filter, setFilter] = useState({ type: "all", difficulty: "all" });

  return (
    <div className="block-library">
      <FilterPanel filter={filter} onChange={setFilter} />
      <BlockGrid blocks={blocks} onSelect={handleBlockSelect} />
      <BlockPreview selectedBlock={selectedBlock} />
    </div>
  );
};
```

### Phase 8: Gradual Cutover (Week 11-12)

**Objective**: Transition fully to modular system

#### Feature Flags:

```typescript
const featureFlags = {
  USE_MODULAR_LESSONS: true,
  ENABLE_BLOCK_EDITOR: true,
  ENABLE_LESSON_TEMPLATES: false, // Gradual rollout
};
```

#### Legacy System Retirement:

```sql
-- Mark legacy content as archived
UPDATE lessons SET content = jsonb_set(
  content,
  '{_migrated}',
  'true'
) WHERE id IN (
  SELECT lesson_id FROM migration_progress
  WHERE migration_status = 'completed'
);
```

## 📊 Migration Metrics

### Success Criteria:

- [ ] **100%** of lessons migrated without data loss
- [ ] **<2s** average lesson load time (improved from current)
- [ ] **Zero** service downtime during migration
- [ ] **95%** user satisfaction with new lesson experience

### Monitoring Dashboard:

```sql
-- Migration progress view
CREATE VIEW migration_dashboard AS
SELECT
  COUNT(*) as total_lessons,
  COUNT(CASE WHEN migration_status = 'completed' THEN 1 END) as migrated_lessons,
  COUNT(CASE WHEN migration_status = 'failed' THEN 1 END) as failed_lessons,
  ROUND(
    COUNT(CASE WHEN migration_status = 'completed' THEN 1 END)::decimal /
    COUNT(*) * 100, 2
  ) as completion_percentage
FROM migration_progress;
```

## 🚨 Rollback Strategy

### Immediate Rollback (if needed):

```typescript
// Feature flag to disable modular system
const EMERGENCY_ROLLBACK = process.env.EMERGENCY_ROLLBACK === "true";

if (EMERGENCY_ROLLBACK) {
  // Route all requests to legacy system
  return await this.getLegacyLesson(lessonId);
}
```

### Data Consistency Checks:

```sql
-- Verify migration integrity
SELECT
  l.id,
  l.name,
  CASE
    WHEN mp.migration_status = 'completed' THEN 'PASS'
    ELSE 'FAIL'
  END as migration_check,
  (SELECT COUNT(*) FROM lesson_blocks lb WHERE lb.lesson_id = l.id) as block_count
FROM lessons l
LEFT JOIN migration_progress mp ON l.id = mp.lesson_id
WHERE l.is_active = true;
```

## 🎉 Benefits Achieved

### Performance Improvements:

- **Faster Loading**: Only load required blocks
- **Better Caching**: Cache individual blocks
- **Reduced Bandwidth**: Progressive content loading

### Content Management:

- **Reusability**: Share blocks across lessons
- **Granular Updates**: Edit specific components
- **Version Control**: Track changes to individual blocks
- **Template System**: Rapid lesson creation

### User Experience:

- **Progressive Loading**: Smooth lesson progression
- **Personalized Paths**: Conditional content delivery
- **Better Progress**: Block-level completion tracking
- **Rich Interactions**: Specialized block types

### Developer Experience:

- **Modular Development**: Component-based architecture
- **Type Safety**: Structured content schemas
- **Testing**: Unit test individual block types
- **Maintenance**: Easier debugging and updates

## 📚 Implementation Timeline

| Week  | Phase          | Key Activities                        | Deliverables                  |
| ----- | -------------- | ------------------------------------- | ----------------------------- |
| 1     | Infrastructure | Schema deployment, utilities          | New tables, migration scripts |
| 2     | Analysis       | Content parsing, block identification | Migration plan per lesson     |
| 3     | Dual-Write     | Service updates, data sync            | Dual-write implementation     |
| 4-5   | Migration      | Background lesson migration           | All lessons migrated          |
| 6     | API Updates    | Smart content delivery                | Dual-read API                 |
| 7-8   | Frontend       | UI updates, block renderers           | New lesson experience         |
| 9-10  | Enhancement    | New features, optimization            | Block library, templates      |
| 11-12 | Cutover        | Feature flags, monitoring             | Full modular system           |

This migration strategy ensures a safe, gradual transition to a more scalable and maintainable lesson architecture.
