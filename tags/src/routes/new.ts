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
		body('name').not().isEmpty().withMessage('Tag is required'),
		body('desc').not().isEmpty().withMessage('Desc is required'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { name, desc } = req.body;
		const status = TagStatus.Awaiting;

		const tag = Tag.build({
			name,
			status,
			desc,
		});

		await tag.save();
		res.status(201).send(tag);
	}
);

export { router as newTagRouter };
