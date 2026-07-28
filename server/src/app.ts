import express from 'express';
import helmet from 'helmet';
import path from 'path';
import { requestIdMiddleware } from './middleware/requestId';
import { errorHandler } from './middleware/errorHandler';
import { analyseRouter } from './routes/analyse';
import { feedbackRouter } from './routes/feedback';
import { healthRouter } from './routes/health';

const app = express();

// Trust Replit's proxy — must be set BEFORE any IP-aware middleware (rate limiting etc.)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// Body parsing — limit keeps request bodies small; images come via multipart
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: false, limit: '50kb' }));

// Request ID — attach before any route handler so every request is traceable
app.use(requestIdMiddleware);

// Routes — rate limiters are applied per-route, not globally
app.use('/health', healthRouter);
app.use('/api/analyse', analyseRouter);
app.use('/api/feedback', feedbackRouter);

// Serve the compiled client in production
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Error handler — must be last middleware
app.use(errorHandler);

export default app;
