import { requireAuth, validateRequest } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { TagStatus } from '../types/tag-status';
import { Tag } from '../models/Tag';
import { TagCreatedPublisher } from '../events/publishers/tag-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
	'/api/tags',
	requireAuth,
	[body('name').not().isEmpty().withMessage('Tag is required')],
	validateRequest,
	async (req: Request, res: Response) => {
		const { name, desc } = req.body;
		const isAdmin = req.currentUser!.admin;
		const status = isAdmin ? TagStatus.Accepted : TagStatus.Awaiting;

		const tag = Tag.build({
			name,
			status,
			desc,
		});

		await tag.save();

		if (tag.status === TagStatus.Accepted) {
			await new TagCreatedPublisher(natsWrapper.client).publish({
				id: tag.id,
				name: tag.name,
				version: tag.version,
			});
		}

		res.status(201).send(tag);
	}
);

export { router as newTagRouter };
