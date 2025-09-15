#!/usr/bin/env node

/**
 * Migration Script: Convert Monolithic Lessons to Modular Architecture
 *
 * This script parses existing lesson content and converts it into
 * modular content blocks for the new scalable architecture.
 */

const { Client } = require("pg");

// Database connection - use Docker network when inside container
const client = new Client({
  host: process.env.NODE_ENV === "development" ? "database" : "localhost",
  port: process.env.NODE_ENV === "development" ? 5432 : 5433,
  database: "compass_learning",
  user: "compass_user",
  password: "compass_password",
});

/**
 * Parse HTML content into logical blocks
 */
function parseContentIntoBlocks(htmlContent, lessonName) {
  const blocks = [];

  // Split content by major headers (h1, h2)
  const sections = htmlContent.split(/(<h[12]>.*?<\/h[12]>)/);

  let currentSection = "introduction";
  let blockOrder = 0;

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i].trim();
    if (!section) continue;

    // Check if this is a header
    const headerMatch = section.match(/<h([12])>(.*?)<\/h[12]>/);
    if (headerMatch) {
      const level = parseInt(headerMatch[1]);
      const title = headerMatch[2].replace(/<[^>]*>/g, ""); // Strip HTML tags

      // Determine section type based on title content
      if (
        title.toLowerCase().includes("example") ||
        title.toLowerCase().includes("practical")
      ) {
        currentSection = "practice";
      } else if (
        title.toLowerCase().includes("next steps") ||
        title.toLowerCase().includes("conclusion")
      ) {
        currentSection = "closure";
      } else if (blockOrder === 0) {
        currentSection = "introduction";
      } else {
        currentSection = "content";
      }

      // Get the content after this header (until next header or end)
      let content = "";
      let nextIndex = i + 1;
      while (
        nextIndex < sections.length &&
        !sections[nextIndex].match(/<h[12]>/)
      ) {
        content += sections[nextIndex];
        nextIndex++;
      }

      // Detect block type based on content
      let blockType = "text";
      if (content.includes("<pre><code>")) {
        blockType = "code";
      } else if (content.includes("<table>")) {
        blockType = "interactive";
      }

      blocks.push({
        title: title,
        type: blockType,
        section: currentSection,
        order: blockOrder++,
        content: {
          text: {
            format: "html",
            content: section + content,
          },
        },
        estimatedTimeMinutes: Math.max(2, Math.ceil(content.length / 500)), // Rough estimate
        difficulty: "beginner",
        tags: extractTags(lessonName, title, content),
        isReusable:
          blockType === "code" || title.toLowerCase().includes("example"),
      });
    }
  }

  // If no blocks were created, create a single content block
  if (blocks.length === 0) {
    blocks.push({
      title: lessonName,
      type: "text",
      section: "content",
      order: 0,
      content: {
        text: {
          format: "html",
          content: htmlContent,
        },
      },
      estimatedTimeMinutes: Math.max(5, Math.ceil(htmlContent.length / 500)),
      difficulty: "beginner",
      tags: extractTags(lessonName, "", htmlContent),
      isReusable: false,
    });
  }

  return blocks;
}

/**
 * Extract tags from lesson content
 */
function extractTags(lessonName, title, content) {
  const tags = [];

  // Add tags based on lesson name
  if (lessonName.toLowerCase().includes("claude flow"))
    tags.push("claude-flow");
  if (lessonName.toLowerCase().includes("hive")) tags.push("hive-mind");
  if (lessonName.toLowerCase().includes("command")) tags.push("commands");
  if (lessonName.toLowerCase().includes("getting started"))
    tags.push("beginner", "tutorial");

  // Add tags based on content
  const lowerContent = (title + " " + content).toLowerCase();
  if (
    lowerContent.includes("npm install") ||
    lowerContent.includes("installation")
  )
    tags.push("installation");
  if (lowerContent.includes("example") || lowerContent.includes("demo"))
    tags.push("examples");
  if (lowerContent.includes("command") || lowerContent.includes("terminal"))
    tags.push("cli", "commands");
  if (lowerContent.includes("agent") || lowerContent.includes("swarm"))
    tags.push("agents");

  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Migrate a single lesson
 */
async function migrateLesson(lesson) {
  console.log(`\nMigrating lesson: ${lesson.name}`);

  try {
    // Parse lesson content into blocks
    const htmlContent = lesson.content.html || JSON.stringify(lesson.content);
    const blocks = parseContentIntoBlocks(htmlContent, lesson.name);

    console.log(`  - Parsed into ${blocks.length} blocks`);

    // Begin transaction
    await client.query("BEGIN");

    // Create content blocks
    const blockIds = [];
    for (const block of blocks) {
      const blockQuery = `
        INSERT INTO content_blocks (
          title, type, content, estimated_time_minutes,
          difficulty, tags, is_reusable, status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'published')
        RETURNING id
      `;

      const blockResult = await client.query(blockQuery, [
        block.title,
        block.type,
        JSON.stringify(block.content),
        block.estimatedTimeMinutes,
        block.difficulty,
        block.tags,
        block.isReusable,
      ]);

      blockIds.push({
        id: blockResult.rows[0].id,
        section: block.section,
        order: block.order,
      });
    }

    // Create modular lesson
    const lessonQuery = `
      INSERT INTO lessons_v2 (
        id, topic_id, name, slug, description,
        lesson_type, skill_level, estimated_duration_minutes,
        learning_objectives, prerequisites, tags
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `;

    const totalTime = blocks.reduce(
      (sum, block) => sum + block.estimatedTimeMinutes,
      0,
    );

    await client.query(lessonQuery, [
      lesson.id, // Keep same ID
      lesson.topic_id,
      lesson.name,
      lesson.slug,
      lesson.description,
      lesson.lesson_type || "reading",
      "beginner", // Default skill level
      totalTime || lesson.estimated_duration_minutes || 15,
      [], // learning_objectives
      [], // prerequisites
      [], // tags
    ]);

    // Link blocks to lesson
    for (const block of blockIds) {
      const linkQuery = `
        INSERT INTO lesson_blocks (
          lesson_id, block_id, section, order_index, required
        )
        VALUES ($1, $2, $3, $4, $5)
      `;

      await client.query(linkQuery, [
        lesson.id,
        block.id,
        block.section,
        block.order,
        true,
      ]);
    }

    // Mark original lesson as migrated
    await client.query(
      `
      UPDATE lessons SET content = jsonb_set(content, '{_migrated}', 'true')
      WHERE id = $1
    `,
      [lesson.id],
    );

    await client.query("COMMIT");
    console.log(`  ✅ Successfully migrated with ${blockIds.length} blocks`);

    return {
      success: true,
      blocksCreated: blockIds.length,
      totalTime: totalTime,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.log(`  ❌ Migration failed: ${error.message}`);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Main migration function
 */
async function migrateLessons() {
  try {
    await client.connect();
    console.log("Connected to database");

    // Get all active lessons
    const lessonsResult = await client.query(`
      SELECT
        id, topic_id, name, slug, description,
        content, lesson_type, estimated_duration_minutes
      FROM lessons
      WHERE is_active = true
        AND (content->>'_migrated' IS NULL OR content->>'_migrated' != 'true')
      ORDER BY created_at
    `);

    const lessons = lessonsResult.rows;
    console.log(`Found ${lessons.length} lessons to migrate`);

    if (lessons.length === 0) {
      console.log("No lessons to migrate");
      return;
    }

    // Migration statistics
    let totalMigrated = 0;
    let totalFailed = 0;
    let totalBlocks = 0;

    // Migrate each lesson
    for (const lesson of lessons) {
      const result = await migrateLesson(lesson);

      if (result.success) {
        totalMigrated++;
        totalBlocks += result.blocksCreated;
      } else {
        totalFailed++;
      }
    }

    // Print summary
    console.log("\n🎉 Migration Summary:");
    console.log(`  📚 Lessons migrated: ${totalMigrated}`);
    console.log(`  🧩 Content blocks created: ${totalBlocks}`);
    console.log(`  ❌ Failed migrations: ${totalFailed}`);
    console.log(
      `  📈 Average blocks per lesson: ${(totalBlocks / totalMigrated || 0).toFixed(1)}`,
    );

    // Validate migration
    console.log("\n🔍 Validating migration...");
    const validationResult = await client.query(`
      SELECT
        COUNT(DISTINCT l.id) as modular_lessons,
        COUNT(cb.id) as total_blocks,
        AVG(cb.estimated_time_minutes) as avg_block_time
      FROM lessons_v2 l
      JOIN lesson_blocks lb ON l.id = lb.lesson_id
      JOIN content_blocks cb ON lb.block_id = cb.id
    `);

    const validation = validationResult.rows[0];
    console.log(`  ✅ Modular lessons: ${validation.modular_lessons}`);
    console.log(`  ✅ Content blocks: ${validation.total_blocks}`);
    console.log(
      `  ✅ Avg block time: ${parseFloat(validation.avg_block_time || 0).toFixed(1)} minutes`,
    );
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.end();
  }
}

// Run migration
if (require.main === module) {
  migrateLessons().catch(console.error);
}

module.exports = { migrateLessons, parseContentIntoBlocks };
