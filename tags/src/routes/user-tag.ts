import { requireAuth } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Tag } from '../models/Tag';
import { TagStatus } from '../types/tag-status';

const router = express.Router();

router.get(
	'/api/tags/usertag',
	requireAuth,
	async (req: Request, res: Response) => {
		const tags = await Tag.find({ username: req.currentUser?.username });

		return res.send(tags);
	}
);

export { router as userTagRouter };
