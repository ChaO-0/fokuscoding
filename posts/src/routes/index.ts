import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/posts', async (req: Request, res: Response) => {
  res.status(200).send({ success: true });
});

export { router as indexPostRouter };
