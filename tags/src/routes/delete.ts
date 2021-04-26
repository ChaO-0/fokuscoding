import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Tag, TagDoc } from '../models/Tag';
import { TagDeletedPublisher } from '../events/publishers/tag-deleted-publisher';
import { natsWrapper } from '../nats-wrapper';
import { TagStatus } from '../types/tag-status';

const router = express.Router();

router.delete(
	'/api/tags/:tag_id',
	requireAuth,
	async (req: Request, res: Response) => {
		const tag: TagDoc = await Tag.findById(req.params.tag_id);

		if (!req.currentUser!.admin) {
			throw new NotAuthorizedError();
		}

		if (!tag) {
			throw new NotFoundError();
		}

		const status = tag.status;
		const is_active = tag.is_active;

		if (status === TagStatus.Awaiting) {
			tag.set({
				status: TagStatus.Rejected,
			});
			await tag.save();

			res.status(204).send(tag);
		}
		if (status === TagStatus.Rejected) {
			tag.remove();

			return res.status(204).send(tag);
		}

		if (status === TagStatus.Accepted && is_active === true) {
			tag.set({
				is_active: false,
			});
			await tag.save();
			res.status(204).send(tag);
		} else if (status === TagStatus.Accepted && is_active === false) {
			tag.set({
				is_active: true,
			});
			await tag.save();
			res.status(204).send(tag);
		}
	}
);

export { router as deleteTagRouter };
