import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import moviesRouter from './routes/movies.js';
import recommendRouter from './routes/recommend.js';
import surpriseRouter from './routes/surprise.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Routes
app.use('/api/movies', moviesRouter);
app.use('/api/recommend', recommendRouter);
app.use('/api/recommend', surpriseRouter);
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'CinePulse',
    timestamp: new Date().toISOString()
  });
});

// 404 Handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[CinePulse Server Error]', err);
  res.status(err.status || 500).json({
    error: 'Internal server error',
    message: err.message || 'An unexpected error occurred'
  });
});

app.listen(PORT, () => {
  console.log(`[CinePulse Server] Running on http://localhost:${PORT}`);
});
