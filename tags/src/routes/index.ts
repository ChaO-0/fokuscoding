import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/tags', async (req: Request, res: Response) => {
	return res.send('success');
});

export { router as indexRouter };
