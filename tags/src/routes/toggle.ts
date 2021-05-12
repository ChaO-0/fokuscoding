import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Tag } from '../models/Tag';
import { TagStatus } from '../types/tag-status';

const router = express.Router();

router.put(
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

		const { status, is_active } = tag;

		if (status === TagStatus.Accepted && is_active === true) {
			tag.set({
				is_active: false,
			});
			await tag.save();
		}

		if (status === TagStatus.Accepted && is_active === false) {
			tag.set({
				is_active: true,
			});
			await tag.save();
		}

		return res.status(204).send(tag);
	}
);

export { router as toggleActiveRouter };
