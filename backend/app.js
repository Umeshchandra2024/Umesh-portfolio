import 'dotenv/config';
import os from 'os';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

import logosRouter from './routes/logos.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import timelineRoutes from './routes/timelineRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import softwareApplicationRoutes from './routes/softwareApplicationRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import { errorMiddleware } from './middleware/error.js';

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.DASHBOARD_URL,
  'https://umesh-portfolio-xi.vercel.app',
  'https://umesh-dashboard.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: os.tmpdir(),
  }),
);

// Health / root
app.get('/', (_req, res) => {
  res.json({ message: 'Portfolio Backend API is running!' });
});

// API routes
app.use('/api/logos', logosRouter);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/project', projectRoutes);
app.use('/api/v1/skill', skillRoutes);
app.use('/api/v1/timeline', timelineRoutes);
app.use('/api/v1/message', messageRoutes);
app.use('/api/v1/software', softwareApplicationRoutes);
app.use('/api/v1/resume', resumeRoutes);

// 404 handler
app.all('*', (req, res) => {
  console.log('404 - Route not found:', req.method, req.originalUrl);
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error middleware (must be last)
app.use(errorMiddleware);

export default app;

