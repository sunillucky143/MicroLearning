# MicroLearning Setup Guide

This guide will help you set up and run the MicroLearning application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **npm** or **yarn** package manager
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd MicroLearning
```

## Step 2: Database Setup

### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE microlearning;

# Exit psql
\q
```

### Get Database URL

Your database URL should look like this:
```
postgresql://username:password@localhost:5432/microlearning
```

Replace `username` and `password` with your PostgreSQL credentials.

## Step 3: Backend Setup

### Install Dependencies

```bash
cd backend
npm install
```

### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/microlearning"
JWT_SECRET="your-super-secret-jwt-key-change-this"
OPENAI_API_KEY="sk-your-openai-api-key"
PORT=3001
NODE_ENV=development
```

**Important:**
- Replace database credentials with your actual PostgreSQL username and password
- Generate a secure JWT_SECRET (you can use: `openssl rand -base64 32`)
- Add your OpenAI API key

### Initialize Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push
```

### Verify Database

You can view your database schema using Prisma Studio:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555`

## Step 4: Frontend Setup

### Install Dependencies

```bash
cd ../frontend
npm install
```

### Configure Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
cp .env.example .env
```

The default values should work:

```env
VITE_API_URL=http://localhost:3001
```

## Step 5: Run the Application

### Option 1: Run Both Servers Together (Recommended)

From the root directory:

```bash
npm run install:all  # If you haven't installed dependencies yet
npm run dev
```

This will start both frontend and backend concurrently.

### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Step 6: Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **API Health Check:** http://localhost:3001/health

## Step 7: Create Your First Account

1. Open http://localhost:5173 in your browser
2. Click "Sign up" to create a new account
3. Fill in your details and register
4. Set up your first learning course!

## Features Overview

### 1. Course Setup
- Input what you want to learn
- Specify your focus area (be detailed!)
- Choose how many topics per day (1-10)
- AI generates 30 days of micro-learning topics

### 2. Daily Learning Dashboard
- View topics assigned for each day
- Navigate between dates (past, present)
- Future dates are locked
- Track completion status

### 3. Interactive Learning Modes
When you select a topic, you can:
- **Content View:** Read the detailed topic content
- **AI Chat:** Interactive Q&A with AI tutor
- **Notes:** Take and save notes per topic
- **2D Game:** Generate educational game (AI-powered)
- **Audio Book:** Convert to audio (placeholder)
- **Podcast:** Podcast-style narration (placeholder)
- **Video:** Video format (placeholder)
- **Comic:** Comic strip format (placeholder)
- **Custom:** Build your own interactive feature

## Troubleshooting

### Database Connection Errors

**Error:** `P1001: Can't reach database server`

**Solution:**
1. Ensure PostgreSQL is running: `pg_ctl status`
2. Check your DATABASE_URL in `.env`
3. Verify credentials with: `psql -U your_username -d microlearning`

### OpenAI API Errors

**Error:** `Failed to generate topics`

**Solutions:**
1. Verify your OPENAI_API_KEY is correct
2. Check your OpenAI account has credits
3. Ensure API key has appropriate permissions

### Port Already in Use

**Error:** `Port 3001 already in use`

**Solution:**
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process
kill -9 <PID>
```

Or change the PORT in `backend/.env`

### Frontend Cannot Connect to Backend

**Error:** Network errors in browser console

**Solutions:**
1. Ensure backend is running on http://localhost:3001
2. Check VITE_API_URL in `frontend/.env`
3. Verify CORS is enabled (already configured)

## Development Tips

### Database Management

```bash
# View database in Prisma Studio
cd backend && npm run db:studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Update schema after changes
npm run db:push && npm run db:generate
```

### API Testing

You can test the API using curl or Postman:

```bash
# Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Viewing Logs

**Backend logs:** Check your terminal running `npm run dev` in backend directory
**Frontend logs:** Check browser developer console (F12)

## Production Deployment

### Environment Variables

For production, update:

**Backend:**
```env
NODE_ENV=production
DATABASE_URL="your-production-database-url"
JWT_SECRET="use-a-very-strong-secret-key"
OPENAI_API_KEY="your-api-key"
```

**Frontend:**
```env
VITE_API_URL="https://your-api-domain.com"
```

### Build

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Serve the 'dist' folder with a static server
```

### Deployment Platforms

**Recommended:**
- **Backend:** Railway, Render, Heroku, AWS, DigitalOcean
- **Database:** Render PostgreSQL, Supabase, AWS RDS
- **Frontend:** Vercel, Netlify, Cloudflare Pages

## Architecture

```
MicroLearning/
├── frontend/           # React + TypeScript + Vite
│   ├── src/
│   │   ├── api/       # API client functions
│   │   ├── components/# React components
│   │   ├── pages/     # Page components
│   │   ├── store/     # Zustand state management
│   │   ├── types/     # TypeScript types
│   │   └── utils/     # Utility functions
│   └── package.json
│
├── backend/           # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/    # Configuration files
│   │   ├── controllers/# Route controllers
│   │   ├── middleware/# Express middleware
│   │   ├── routes/    # API routes
│   │   ├── services/  # Business logic (OpenAI)
│   │   ├── types/     # TypeScript types
│   │   └── utils/     # Utility functions
│   ├── prisma/        # Database schema
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Courses
- `POST /api/courses` - Create new course (generates topics with AI)
- `GET /api/courses/active` - Get active course
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID

### Topics
- `GET /api/topics/date/:date` - Get topics for specific date (YYYY-MM-DD)
- `GET /api/topics/:id` - Get topic by ID
- `PATCH /api/topics/:id/complete` - Mark topic as complete
- `GET /api/topics/course/:courseId` - Get all topics for course

### Notes
- `GET /api/notes/topic/:topicId` - Get note for topic
- `POST /api/notes` - Create new note
- `PATCH /api/notes/:id` - Update note

### Learning Modes
- `POST /api/learning/chat/:topicId` - Chat with AI about topic
- `POST /api/learning/game/:topicId` - Generate 2D game
- `POST /api/learning/audio/:topicId` - Convert to audio
- `POST /api/learning/podcast/:topicId` - Convert to podcast
- `POST /api/learning/video/:topicId` - Convert to video
- `POST /api/learning/comic/:topicId` - Convert to comic
- `POST /api/learning/custom/:topicId` - Build custom feature

## Support

If you encounter any issues:

1. Check this guide's troubleshooting section
2. Review the logs (backend terminal and browser console)
3. Ensure all prerequisites are installed
4. Verify environment variables are set correctly

## Next Steps

After successful setup:

1. Create an account
2. Set up your first course
3. Start learning with daily topics!
4. Try different learning modes
5. Take notes and track your progress

Happy Learning! 🎓
