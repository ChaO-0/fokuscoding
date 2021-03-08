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
	[
		body('tags').not().isEmpty().withMessage('Tag is required'),
		body('description').not().isEmpty().withMessage('Desc is required'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { tags, description } = req.body;
		let status = TagStatus.Awaiting;

		if (req.currentUser?.admin) {
			status = TagStatus.Accepted;
		}

		const tag = Tag.build({
			name: tags,
			status,
			description,
		});

		await tag.save();

		if (req.currentUser?.admin) {
			await new TagCreatedPublisher(natsWrapper.client).publish({
				id: tag.id,
				name: tag.name,
			});
		}
		res.status(201).send(tag);
	}
);

export { router as newTagRouter };
