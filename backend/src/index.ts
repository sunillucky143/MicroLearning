import express from 'express';
import cors from 'cors';
import { config } from './config/env';

// Import routes
import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';
import topicRoutes from './routes/topics';
import noteRoutes from './routes/notes';
import learningRoutes from './routes/learning';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/learning', learningRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

// Start server
const PORT = config.port;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🎓 MicroLearning API Server                         ║
║                                                       ║
║   Server running on: http://localhost:${PORT}         ║
║   Environment: ${config.nodeEnv}                      ║
║                                                       ║
║   Available endpoints:                                ║
║   - POST /api/auth/register                           ║
║   - POST /api/auth/login                              ║
║   - GET  /api/auth/me                                 ║
║   - POST /api/courses                                 ║
║   - GET  /api/topics/date/:date                       ║
║   - POST /api/learning/chat/:topicId                  ║
║   - POST /api/learning/game/:topicId                  ║
║   - And more...                                       ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

export default app;
