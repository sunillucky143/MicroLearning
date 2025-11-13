# MicroLearning To-Do App

An AI-powered micro-learning application that helps users learn any topic through bite-sized daily tasks with interactive features.

## Features

### 🎯 Core Features
- **Personalized Learning Path**: Input your course focus and daily learning capacity
- **AI-Generated Topics**: Automatically generates micro-topics using AI
- **Interactive To-Do Calendar**: Navigate through learning tasks with date-based organization
- **Past & Present Learning**: Access current and past topics (future topics are locked)

### 📚 Learning Modes
When you select a topic, you can learn through multiple interactive modes:
- **AI Chat Learning**: Interactive learning with AI assistance
- **Notes Canvas**: Take and save notes for each topic
- **2D Game Mode**: Convert topics into interactive educational games
- **Audio Book**: Listen to topics as audio books
- **Podcast**: Experience topics in podcast format
- **Video**: Watch topics as videos
- **Comic**: Read topics in comic format
- **Custom Builder**: Create your own interactive learning experience

## Tech Stack

### Frontend
- React + TypeScript
- Vite
- TailwindCSS
- React Router

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- OpenAI API Integration

## Quick Start

**📖 For detailed setup instructions, see [SETUP.md](SETUP.md)**

### Prerequisites
- Node.js 18+
- PostgreSQL
- OpenAI API Key

### Installation

1. **Clone and install dependencies:**
```bash
npm run install:all
```

2. **Set up database:**
```bash
cd backend
npm run db:generate
npm run db:push
```

3. **Configure environment variables:**
```bash
# Backend: Copy .env.example to .env and fill in your credentials
cd backend
cp .env.example .env

# Frontend: Copy .env.example to .env
cd ../frontend
cp .env.example .env
```

4. **Run the app:**
```bash
cd ..
npm run dev
```

5. **Open your browser:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Environment Variables

**Backend (.env)**
```
DATABASE_URL="postgresql://user:password@localhost:5432/microlearning"
JWT_SECRET="your-secret-key"
OPENAI_API_KEY="your-openai-api-key"
PORT=3001
```

**Frontend (.env)**
```
VITE_API_URL="http://localhost:3001"
```

## Project Structure

```
MicroLearning/
├── frontend/          # React frontend application
├── backend/           # Express backend API
├── package.json       # Root package file
└── README.md          # This file
```

## Development

- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:3001`

## License

MIT
