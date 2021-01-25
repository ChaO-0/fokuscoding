import { requireAuth } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { TagStatus } from '../types/tag-status';
import { Tag } from '../models/Tag';
import { TagCreatedPublisher } from '../events/tag-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
	'/api/tags',
	requireAuth,
	[body('name').not().isEmpty().withMessage('Tag is required')],
	async (req: Request, res: Response) => {
		const { name } = req.body;
		const isAdmin = req.currentUser!.admin;
		const status = isAdmin ? TagStatus.Accepted : TagStatus.Awaiting;

		const tag = Tag.build({
			name,
			status,
		});

		await tag.save();
		await new TagCreatedPublisher(natsWrapper.client).publish({
			id: tag.id,
			name: tag.name,
			status: tag.status,
			version: tag.version,
		});

		res.status(201).send(tag);
	}
);

export { router as newTagRouter };
