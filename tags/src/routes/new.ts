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
		body('name').not().isEmpty().withMessage('Tag name is required'),
		body('description').not().isEmpty().withMessage('Desc is required'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { name, description } = req.body;
		const { username } = req.currentUser!;
		let status = TagStatus.Awaiting;

		if (req.currentUser?.admin) {
			status = TagStatus.Accepted;
		}

		const tag = Tag.build({
			name: name.toLowerCase(),
			description: description.toLowerCase(),
			username,
			status,
			is_active: true,
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
