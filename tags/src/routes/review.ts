import { NotAuthorizedError, requireAuth } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Tag } from '../models/Tag';
import { TagStatus } from '../types/tag-status';

const router = express.Router();

router.get(
	'/api/tags/review',
	requireAuth,
	async (req: Request, res: Response) => {
		let status = TagStatus.Awaiting;
		const statusQuery = req.query.status;

		if (statusQuery === TagStatus.Accepted) {
			status = TagStatus.Accepted;
		}

		if (statusQuery === TagStatus.Rejected) {
			status = TagStatus.Rejected;
		}

		if (req.currentUser?.admin === false) {
			throw new NotAuthorizedError();
		}
		const tags = await Tag.find({ status: status });

		return res.send(tags);
	}
);

export { router as reviewTagRouter };
