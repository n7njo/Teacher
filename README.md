# SkillForge Learning Platform

⚒️ **Forge your skills through structured learning paths**

SkillForge is a modern, Docker-based learning platform designed to help users master new skills through a structured category → topic → lesson hierarchy. Built with React, Node.js, and PostgreSQL, it provides an engaging educational experience with progress tracking and interactive content.

## 🚀 Features

- **Structured Learning Path**: Organized in a clear Category → Topic → Lesson hierarchy
- **Interactive Content**: Rich HTML content with code examples and exercises  
- **Progress Tracking**: Track completion and time spent on each lesson
- **Modern Tech Stack**: React frontend, Node.js backend, PostgreSQL database
- **Docker-First**: Complete containerized development and deployment
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile
- **Skill Progression**: Enhanced curriculum architecture supporting different skill levels

## 🏗️ Architecture

### Core Structure
```
Categories (e.g., "Using AI")
├── Topics (e.g., "Claude Flow")
    └── Lessons (e.g., "Basics of Learning Claude Flow")
```

### Enhanced Features
- **Skill Levels**: Beginner → Intermediate → Advanced → Expert
- **Learning Objectives**: Structured using Bloom's Taxonomy
- **Interactive Elements**: Code editors, visualizations, simulations
- **Assessment System**: Comprehensive evaluation with rubrics
- **Modular Content**: Reusable content blocks for scalable lesson creation

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0 with TypeScript
- **React Router** for navigation
- **Axios** for API communication
- **Modern CSS** with glassmorphism effects

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** 15 database
- **Docker** for containerization

### Development Tools
- **Jest** for testing
- **ESLint** & **Prettier** for code quality
- **Nodemon** for development hot reload

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)

### Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd skillforge-learning-platform
```

2. **Start all services**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5433

3. **Access the platform**
Open your browser to http://localhost:3000

### Individual Service Management

```bash
# Backend only
npm run dev:backend

# Frontend only  
npm run dev:frontend

# Build all services
npm run build

# Run tests
npm test

# Clean up containers and volumes
npm run clean
```

## 🗄️ Database Schema

The platform uses a PostgreSQL database with the following key tables:

- **categories**: Top-level learning categories
- **topics**: Topics within categories
- **lessons**: Individual lessons with rich JSONB content
- **users**: User accounts and profiles
- **user_progress**: Lesson completion tracking
- **user_topic_progress**: Topic-level progress summaries

Enhanced schema includes:
- **content_blocks**: Modular, reusable content components
- **lessons_v2**: Advanced lesson structure with skill levels
- **lesson_blocks**: Links lessons to their content blocks

## 📚 API Endpoints

### Core Endpoints
```
GET /api/categories          # List all categories
GET /api/topics/:categoryId  # Topics in a category
GET /api/lessons/:topicId    # Lessons in a topic
GET /api/lesson/:lessonId    # Individual lesson content
```

### Enhanced Endpoints
```
GET /api/modular/lessons/:id    # Modular lesson structure
GET /api/modular/blocks         # Available content blocks
POST /api/progress             # Track user progress
```

## 🔧 Configuration

### Environment Variables

```bash
# Backend (.env)
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://skillforge_user:skillforge_password@database:5432/skillforge_learning

# Frontend
REACT_APP_API_URL=http://localhost:3001
```

### Docker Services

- **skillforge_db**: PostgreSQL database
- **skillforge_backend**: Node.js API server
- **skillforge_frontend**: React development server

## 🧪 Testing

### Run Tests
```bash
# All tests
npm test

# Backend tests only
cd backend && npm test

# Frontend tests only  
cd frontend && npm test

# Test with coverage
npm run test:coverage
```

### Test Database
Tests use a separate database: `skillforge_learning_test`

## 📈 Development Roadmap

### Phase 1: Foundation ✅
- Basic CRUD operations
- Docker containerization
- Initial UI/UX design

### Phase 2: Enhanced Features 🚧
- Modular content system
- Advanced progress tracking
- Skill progression framework

### Phase 3: Advanced Capabilities 🔜
- Interactive assessments
- Personalization engine
- Analytics and reporting

### Phase 4: Scale & Polish 🔜
- Performance optimization
- Advanced UI components
- Production deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- **ESLint** and **Prettier** must pass
- **Test coverage** should be maintained
- **TypeScript** types required for all new code
- **Docker** containers should build successfully

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Vision

SkillForge aims to revolutionize technical education by providing:

- **Structured Learning**: Clear pathways from novice to expert
- **Interactive Engagement**: Hands-on coding and practical exercises  
- **Adaptive Content**: Personalized learning experiences
- **Community Building**: Collaborative learning environment
- **Industry Relevance**: Real-world skills and applications

---

**Built with ❤️ for learners everywhere**

Transform your potential into expertise with SkillForge - where every skill is forged through practice, persistence, and passion.
