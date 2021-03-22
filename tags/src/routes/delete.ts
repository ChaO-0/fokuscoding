import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Tag } from '../models/Tag';
import { TagDeletedPublisher } from '../events/publishers/tag-deleted-publisher';
import { natsWrapper } from '../nats-wrapper';
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

		const status = tag.status;

		if (status === TagStatus.Accepted || status === TagStatus.Rejected) {
			tag.remove();
			await new TagDeletedPublisher(natsWrapper.client).publish({
				id: tag.id,
			});

			return res.status(204).send(tag);
		}

		tag.set({
			status: TagStatus.Rejected,
		});
		await tag.save();

		res.status(204).send(tag);
	}
);

export { router as deleteTagRouter };
