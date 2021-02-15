import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Tag } from '../models/Tag';
import { TagStatus } from '../types/tag-status';
import { TagCreatedPublisher } from '../events/publishers/tag-created-publisher';
import { natsWrapper } from '../nats-wrapper';

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

		if (!tag) {
			throw new NotFoundError();
		}

		tag.set({
			status: TagStatus.Accepted,
		});

		await tag.save();

		await new TagCreatedPublisher(natsWrapper.client).publish({
			id: tag.id,
			name: tag.name,
		});

		return res.send(tag);
	}
);

export { router as acceptTagRouter };
