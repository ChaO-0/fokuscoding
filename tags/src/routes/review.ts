import { NotAuthorizedError, requireAuth } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Tag } from '../models/Tag';
import { TagStatus } from '../types/tag-status';

const router = express.Router();

router.get(
	'/api/tags/review',
	requireAuth,
	async (req: Request, res: Response) => {
		if (req.currentUser?.admin === false) {
			throw new NotAuthorizedError();
		}
		const tags = await Tag.find({ status: TagStatus.Awaiting });

		return res.send(tags);
	}
);

export { router as reviewTagRouter };
