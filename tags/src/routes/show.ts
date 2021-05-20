import { requireAuth } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Tag } from '../models/Tag';
import { TagStatus } from '../types/tag-status';

const router = express.Router();

router.get(
	'/api/tags/:tagName',
	requireAuth,
	async (req: Request, res: Response) => {
		const tags = await Tag.findOne({
			status: TagStatus.Accepted,
			name: req.params.tagName,
		});

		return res.send(tags);
	}
);

export { router as showTagRouter };
