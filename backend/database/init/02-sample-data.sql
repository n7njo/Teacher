-- Sample data for Compass Learning Platform
-- Creating the "Using AI" category with claude-flow topic and first lesson

-- Insert "Using AI" category
INSERT INTO categories (id, name, description, slug, icon, order_index, is_active) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Using AI',
    'Learn how to effectively use AI tools and technologies to enhance your productivity and capabilities.',
    'using-ai',
    '🤖',
    1,
    true
);

-- Insert claude-flow topic
INSERT INTO topics (id, category_id, name, description, slug, order_index, estimated_duration_minutes, difficulty_level, is_active) VALUES (
    'b2c3d4e5-f637-4901-bcde-f23456789012',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Claude Flow',
    'Master the fundamentals of Claude Flow - a powerful system for creating AI-powered workflows and automation.',
    'claude-flow',
    1,
    45,
    'beginner',
    true
);

-- Insert first lesson: "Basics of Learning Claude Flow"
INSERT INTO lessons (id, topic_id, name, description, slug, content, order_index, estimated_duration_minutes, lesson_type, is_active) VALUES (
    'c3d4e5f6-a748-4912-cdef-345678901234',
    'b2c3d4e5-f637-4901-bcde-f23456789012',
    'Basics of Learning Claude Flow',
    'Your comprehensive introduction to Claude Flow concepts, architecture, and getting started with your first workflow.',
    'basics-of-learning-claude-flow',
    '{
        "html": "<h1>Welcome to Claude Flow</h1><p>Claude Flow is a revolutionary system that enables you to create sophisticated AI-powered workflows with ease. This lesson will introduce you to the core concepts and help you understand how to leverage this powerful technology.</p><h2>What is Claude Flow?</h2><p>Claude Flow is a visual workflow builder that allows you to:</p><ul><li><strong>Create AI Workflows</strong>: Build complex AI-powered processes using a drag-and-drop interface</li><li><strong>Automate Tasks</strong>: Connect different AI models and services to automate repetitive tasks</li><li><strong>Scale Intelligence</strong>: Deploy AI solutions that can handle large-scale operations</li><li><strong>Integrate Seamlessly</strong>: Connect with existing tools and platforms through APIs</li></ul><h2>Core Components</h2><h3>1. Nodes</h3><p>Nodes are the building blocks of your Claude Flow workflows. Each node represents a specific action or processing step:</p><ul><li><strong>Input Nodes</strong>: Receive data from external sources</li><li><strong>Processing Nodes</strong>: Transform, analyze, or manipulate data</li><li><strong>AI Nodes</strong>: Leverage Claude and other AI models</li><li><strong>Output Nodes</strong>: Send results to destinations</li></ul><h3>2. Connections</h3><p>Connections define how data flows between nodes. They represent:</p><ul><li>Data pathways</li><li>Conditional logic</li><li>Error handling routes</li><li>Parallel processing branches</li></ul><h3>3. Triggers</h3><p>Triggers determine when your workflows execute:</p><ul><li><strong>Manual Triggers</strong>: Start workflows on-demand</li><li><strong>Scheduled Triggers</strong>: Run workflows at specific times</li><li><strong>Event Triggers</strong>: Respond to external events</li><li><strong>Webhook Triggers</strong>: React to HTTP requests</li></ul><h2>Getting Started: Your First Workflow</h2><p>Let''s create a simple workflow that demonstrates Claude Flow''s capabilities:</p><h3>Step 1: Create a New Flow</h3><pre><code>1. Open Claude Flow dashboard\n2. Click \"New Flow\"\n3. Choose \"Blank Flow\" template\n4. Name your flow \"My First AI Workflow\"</code></pre><h3>Step 2: Add Input Node</h3><pre><code>1. Drag \"Text Input\" node from the palette\n2. Configure it to accept user messages\n3. Set the input field name to \"user_query\"</code></pre><h3>Step 3: Add AI Processing Node</h3><pre><code>1. Add \"Claude AI\" node\n2. Connect it to the Text Input node\n3. Configure the prompt: \"Please help answer this question: {{user_query}}\"</code></pre><h3>Step 4: Add Output Node</h3><pre><code>1. Add \"Text Output\" node\n2. Connect it to the Claude AI node\n3. Configure it to display the AI response</code></pre><h3>Step 5: Test Your Flow</h3><pre><code>1. Click \"Test Flow\"\n2. Enter a sample query\n3. Observe the AI-generated response\n4. Refine as needed</code></pre><h2>Best Practices</h2><h3>Design Principles</h3><ul><li><strong>Keep it Simple</strong>: Start with basic workflows and gradually add complexity</li><li><strong>Error Handling</strong>: Always include error handling nodes for robust workflows</li><li><strong>Documentation</strong>: Add descriptions to nodes for maintainability</li><li><strong>Testing</strong>: Test workflows thoroughly before deployment</li></ul><h3>Performance Optimization</h3><ul><li><strong>Parallel Processing</strong>: Use parallel branches for independent operations</li><li><strong>Caching</strong>: Implement caching for frequently accessed data</li><li><strong>Resource Management</strong>: Monitor and optimize resource usage</li><li><strong>Batch Processing</strong>: Process multiple items together when possible</li></ul><h2>Common Use Cases</h2><h3>Content Generation</h3><p>Create workflows that generate content based on templates, data, and AI insights.</p><h3>Data Analysis</h3><p>Build flows that process and analyze large datasets using AI-powered analytics.</p><h3>Customer Support</h3><p>Develop intelligent support systems that can understand and respond to customer inquiries.</p><h3>Document Processing</h3><p>Automate document analysis, extraction, and transformation tasks.</p><h2>Next Steps</h2><p>Now that you understand the basics of Claude Flow, you''re ready to:</p><ol><li><strong>Explore Advanced Nodes</strong>: Learn about specialized processing nodes</li><li><strong>Master Conditional Logic</strong>: Build workflows with complex decision trees</li><li><strong>Integrate External Services</strong>: Connect to APIs and databases</li><li><strong>Deploy to Production</strong>: Learn best practices for production deployment</li></ol><h2>Resources</h2><ul><li><a href=\"#\">Claude Flow Documentation</a></li><li><a href=\"#\">Community Examples</a></li><li><a href=\"#\">Video Tutorials</a></li><li><a href=\"#\">Support Forum</a></li></ul><h2>Summary</h2><p>Claude Flow empowers you to create sophisticated AI workflows without extensive programming knowledge. By understanding nodes, connections, and triggers, you can build powerful automation solutions that scale with your needs.</p><p>In the next lesson, we''ll dive deeper into advanced node configurations and explore how to build more complex workflows with conditional logic and parallel processing.</p>"
    }',
    1,
    30,
    'reading',
    true
);

-- Create a sample user for testing
INSERT INTO users (id, username, email, full_name, role, is_active) VALUES (
    'd4e5f6g7-h859-4123-defg-456789012345',
    'demo_learner',
    'demo@compass-learning.local',
    'Demo Learner',
    'student',
    true
);