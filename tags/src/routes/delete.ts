import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Tag, TagDoc } from '../models/Tag';
import { TagStatus } from '../types/tag-status';

const router = express.Router();

router.delete(
	'/api/tags/:tag_id',
	requireAuth,
	async (req: Request, res: Response) => {
		const tag = await Tag.findById(req.params.tag_id);

		if (!req.currentUser!.admin) {
			throw new NotAuthorizedError();
		}

		if (!tag) {
			throw new NotFoundError();
		}

		const { status } = tag;

		if (status === TagStatus.Awaiting) {
			tag.set({
				status: TagStatus.Rejected,
			});
			await tag.save();
		}

		return res.status(204).send(tag);
	}
);

export { router as deleteTagRouter };
