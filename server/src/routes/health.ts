import { Router, Request, Response } from 'express';

export const healthRouter = Router();

// No rate limiting on the health endpoint
healthRouter.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});
