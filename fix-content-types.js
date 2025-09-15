#!/usr/bin/env node

/**
 * Fix Content Block Types
 *
 * The migration script incorrectly classified some text blocks as "code" blocks
 * just because they contained <pre><code> tags. This script fixes that.
 */

const { Client } = require("pg");

// Database connection
const client = new Client({
  host: process.env.NODE_ENV === "development" ? "database" : "localhost",
  port: process.env.NODE_ENV === "development" ? 5432 : 5433,
  database: "skillforge_learning",
  user: "skillforge_user",
  password: "skillforge_password",
});

async function fixContentTypes() {
  try {
    await client.connect();
    console.log("Connected to database");

    // Get all blocks that are currently marked as 'code' type
    const codeBlocks = await client.query(`
      SELECT id, title, content
      FROM content_blocks
      WHERE type = 'code'
    `);

    console.log(`Found ${codeBlocks.rows.length} blocks marked as 'code' type`);

    let fixed = 0;

    for (const block of codeBlocks.rows) {
      const content = block.content;

      // Check if this is actually text content with some code examples
      if (content.text && content.text.content) {
        const htmlContent = content.text.content;

        // Count total content vs code content
        const totalLength = htmlContent.length;
        const codeMatches =
          htmlContent.match(/<pre><code>[\s\S]*?<\/code><\/pre>/g) || [];
        const codeLength = codeMatches.reduce(
          (sum, match) => sum + match.length,
          0,
        );

        // If code is less than 70% of the content, it's probably a text block with code examples
        const codePercentage = (codeLength / totalLength) * 100;

        if (codePercentage < 70) {
          console.log(
            `Fixing block "${block.title}" (${codePercentage.toFixed(1)}% code) -> text`,
          );

          await client.query(
            `
            UPDATE content_blocks
            SET type = 'text'
            WHERE id = $1
          `,
            [block.id],
          );

          fixed++;
        } else {
          console.log(
            `Keeping block "${block.title}" as code (${codePercentage.toFixed(1)}% code)`,
          );
        }
      }
    }

    console.log(`\n✅ Fixed ${fixed} content blocks`);

    // Show updated distribution
    const distribution = await client.query(`
      SELECT type, COUNT(*) as count
      FROM content_blocks
      GROUP BY type
      ORDER BY count DESC
    `);

    console.log("\nUpdated content block distribution:");
    distribution.rows.forEach((row) => {
      console.log(`  ${row.type}: ${row.count}`);
    });
  } catch (error) {
    console.error("Error fixing content types:", error);
  } finally {
    await client.end();
  }
}

// Run the fix
if (require.main === module) {
  fixContentTypes().catch(console.error);
}

module.exports = { fixContentTypes };
