import { requireAuth } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Tag } from '../models/Tag';

const router = express.Router();

router.get('/api/tags', requireAuth, async (req: Request, res: Response) => {
	const tags = await Tag.find();

	return res.send(tags);
});

export { router as indexTagRouter };
