import { NotAuthorizedError, requireAuth } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Tag } from '../models/Tag';
import { TagStatus } from '../types/tag-status';

const router = express.Router();

router.post(
	'/api/tags/:tag_id/accept',
	requireAuth,
	async (req: Request, res: Response) => {
		const tag = await Tag.findById(req.params.tag_id);
		const isAdmin = req.currentUser!.admin;

		if (!isAdmin) {
			throw new NotAuthorizedError();
		}

		tag.set({
			status: TagStatus.Accepted,
		});

		tag.save();

		return res.send(tag);
	}
);

export { router as acceptTagRouter };
