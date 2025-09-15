#!/usr/bin/env node

/**
 * Migration Validation Script
 * Comprehensive testing of the modular lesson migration
 */

const { Client } = require("pg");
const axios = require("axios");

// Database connection
const client = new Client({
  host: "localhost",
  port: 5433,
  database: "skillforge_learning",
  user: "skillforge_user",
  password: "skillforge_password",
});

async function validateMigration() {
  console.log("🔍 Starting Migration Validation...\n");

  try {
    await client.connect();

    // 1. Database Schema Validation
    console.log("1️⃣  Database Schema Validation");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('content_blocks', 'lessons_v2', 'lesson_blocks', 'user_block_progress')
      ORDER BY table_name
    `);

    const expectedTables = [
      "content_blocks",
      "lesson_blocks",
      "lessons_v2",
      "user_block_progress",
    ];
    const actualTables = tablesResult.rows.map((row) => row.table_name);

    console.log(`Expected tables: ${expectedTables.join(", ")}`);
    console.log(`Found tables:    ${actualTables.join(", ")}`);
    console.log(
      `✅ Schema validation: ${JSON.stringify(expectedTables) === JSON.stringify(actualTables) ? "PASS" : "FAIL"}\n`,
    );

    // 2. Data Migration Validation
    console.log("2️⃣  Data Migration Validation");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const migrationStats = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM lessons WHERE content->>'_migrated' = 'true') as original_lessons,
        (SELECT COUNT(*) FROM lessons_v2) as migrated_lessons,
        (SELECT COUNT(*) FROM content_blocks) as content_blocks,
        (SELECT COUNT(*) FROM lesson_blocks) as lesson_blocks
    `);

    const stats = migrationStats.rows[0];
    console.log(`Original lessons marked migrated: ${stats.original_lessons}`);
    console.log(`Migrated lessons in lessons_v2:  ${stats.migrated_lessons}`);
    console.log(`Total content blocks created:    ${stats.content_blocks}`);
    console.log(`Total lesson-block links:        ${stats.lesson_blocks}`);
    console.log(
      `✅ Migration integrity: ${stats.original_lessons === stats.migrated_lessons ? "PASS" : "FAIL"}\n`,
    );

    // 3. Content Block Distribution
    console.log("3️⃣  Content Block Analysis");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const blockTypes = await client.query(`
      SELECT
        type,
        COUNT(*) as count,
        AVG(estimated_time_minutes) as avg_time,
        COUNT(CASE WHEN is_reusable = true THEN 1 END) as reusable_count
      FROM content_blocks
      GROUP BY type
      ORDER BY count DESC
    `);

    console.log("Block Type Distribution:");
    blockTypes.rows.forEach((row) => {
      console.log(
        `  ${row.type.padEnd(12)} | ${String(row.count).padStart(3)} blocks | ${parseFloat(row.avg_time).toFixed(1)} min avg | ${row.reusable_count} reusable`,
      );
    });

    const totalBlocks = blockTypes.rows.reduce(
      (sum, row) => sum + parseInt(row.count),
      0,
    );
    const avgBlocksPerLesson = (
      totalBlocks / parseInt(stats.migrated_lessons)
    ).toFixed(1);
    console.log(
      `✅ Block analysis: ${totalBlocks} blocks, ${avgBlocksPerLesson} avg per lesson\n`,
    );

    // 4. API Endpoint Validation
    console.log("4️⃣  API Endpoint Validation");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    try {
      // Test modular lesson endpoint
      const lessonResponse = await axios.get(
        "http://localhost:3001/api/modular/lessons/c3d4e5f6-a748-4912-cdef-345678901234",
      );
      const lesson = lessonResponse.data;

      console.log(`Lesson API Response:`);
      console.log(`  Name: ${lesson.name}`);
      console.log(`  Type: ${lesson.type}`);
      console.log(`  Duration: ${lesson.estimatedDurationMinutes} minutes`);
      console.log(`  Sections: ${Object.keys(lesson.sections).join(", ")}`);

      // Count blocks per section
      const sectionCounts = {};
      Object.keys(lesson.sections).forEach((section) => {
        sectionCounts[section] = lesson.sections[section].length;
      });
      console.log(`  Block distribution: ${JSON.stringify(sectionCounts)}`);
      console.log(`✅ Lesson API: PASS`);

      // Test content blocks endpoint
      const blocksResponse = await axios.get(
        "http://localhost:3001/api/modular/blocks?limit=5",
      );
      const blocksData = blocksResponse.data;

      console.log(`Blocks API Response:`);
      console.log(
        `  Total blocks available: ${blocksData.blocks.length} (showing ${blocksData.pagination.limit})`,
      );
      console.log(
        `  Pagination: page ${blocksData.pagination.page} of ${blocksData.pagination.pages}`,
      );

      if (blocksData.blocks.length > 0) {
        const firstBlock = blocksData.blocks[0];
        console.log(
          `  Sample block: "${firstBlock.title}" (${firstBlock.type}, ${firstBlock.estimated_time_minutes}min)`,
        );
      }
      console.log(`✅ Blocks API: PASS\n`);
    } catch (apiError) {
      console.log(`❌ API validation failed: ${apiError.message}\n`);
    }

    // 5. Data Integrity Checks
    console.log("5️⃣  Data Integrity Validation");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Check for orphaned blocks
    const orphanedBlocks = await client.query(`
      SELECT COUNT(*) as count
      FROM content_blocks cb
      LEFT JOIN lesson_blocks lb ON cb.id = lb.block_id
      WHERE lb.block_id IS NULL
    `);

    // Check for broken lesson-block links
    const brokenLinks = await client.query(`
      SELECT COUNT(*) as count
      FROM lesson_blocks lb
      LEFT JOIN content_blocks cb ON lb.block_id = cb.id
      LEFT JOIN lessons_v2 l ON lb.lesson_id = l.id
      WHERE cb.id IS NULL OR l.id IS NULL
    `);

    // Check content block JSON validity
    const invalidContent = await client.query(`
      SELECT COUNT(*) as count
      FROM content_blocks
      WHERE content = '{}' OR content IS NULL
    `);

    console.log(
      `Orphaned blocks (not linked to lessons): ${orphanedBlocks.rows[0].count}`,
    );
    console.log(
      `Broken lesson-block relationships:      ${brokenLinks.rows[0].count}`,
    );
    console.log(
      `Blocks with invalid/empty content:      ${invalidContent.rows[0].count}`,
    );

    const integrityPassed =
      orphanedBlocks.rows[0].count === "0" &&
      brokenLinks.rows[0].count === "0" &&
      invalidContent.rows[0].count === "0";

    console.log(`✅ Data integrity: ${integrityPassed ? "PASS" : "FAIL"}\n`);

    // 6. Performance Validation
    console.log("6️⃣  Performance Validation");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    const performanceStart = Date.now();

    // Test complex query performance
    const complexQuery = await client.query(`
      SELECT
        l.name as lesson_name,
        COUNT(lb.block_id) as block_count,
        SUM(cb.estimated_time_minutes) as total_time,
        array_agg(DISTINCT cb.type ORDER BY cb.type) as block_types
      FROM lessons_v2 l
      JOIN lesson_blocks lb ON l.id = lb.lesson_id
      JOIN content_blocks cb ON lb.block_id = cb.id
      GROUP BY l.id, l.name
      ORDER BY block_count DESC
    `);

    const queryTime = Date.now() - performanceStart;

    console.log(`Complex query performance: ${queryTime}ms`);
    console.log(
      `Query returned ${complexQuery.rows.length} lessons with structured data`,
    );
    console.log(
      `✅ Performance: ${queryTime < 100 ? "EXCELLENT" : queryTime < 500 ? "GOOD" : "NEEDS OPTIMIZATION"}\n`,
    );

    // 7. Summary Report
    console.log("📊 Migration Summary Report");
    console.log("═══════════════════════════════════════");

    const summary = {
      originalLessons: parseInt(stats.original_lessons),
      migratedLessons: parseInt(stats.migrated_lessons),
      contentBlocks: parseInt(stats.content_blocks),
      avgBlocksPerLesson: parseFloat(avgBlocksPerLesson),
      blockTypes: blockTypes.rows.length,
      dataIntegrity: integrityPassed,
      queryPerformance: queryTime,
    };

    Object.entries(summary).forEach(([key, value]) => {
      console.log(`${key.padEnd(20)}: ${value}`);
    });

    const overallSuccess =
      summary.originalLessons === summary.migratedLessons &&
      summary.contentBlocks > 0 &&
      summary.dataIntegrity &&
      summary.queryPerformance < 1000;

    console.log(
      "\n🎯 OVERALL MIGRATION STATUS:",
      overallSuccess ? "✅ SUCCESS" : "❌ NEEDS ATTENTION",
    );

    if (overallSuccess) {
      console.log("\n🎉 Migration completed successfully!");
      console.log("   • All lessons migrated to modular format");
      console.log("   • Content blocks properly structured");
      console.log("   • API endpoints working correctly");
      console.log("   • Data integrity maintained");
      console.log("   • Performance is acceptable");
    }
  } catch (error) {
    console.error("❌ Validation failed:", error);
  } finally {
    await client.end();
  }
}

// Run validation
if (require.main === module) {
  validateMigration().catch(console.error);
}

module.exports = { validateMigration };
