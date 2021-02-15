import {
	NotAuthorizedError,
	requireAuth,
	validateRequest,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { TagStatus } from '../types/tag-status';
import { Tag } from '../models/Tag';
import { TagUpdatedPublisher } from '../events/publishers/tag-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
	'/api/tags/:tag_id',
	requireAuth,
	[
		body('name').not().isEmpty().withMessage('Tag is required'),
		body('desc').not().isEmpty().withMessage('Desc is required'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { name, desc } = req.body;
		const isAdmin = req.currentUser!.admin;

		const tag = await Tag.findById(req.params.tag_id);

		if (!isAdmin) {
			throw new NotAuthorizedError();
		}

		tag.set({
			name,
			desc,
		});

		await tag.save();

		if (tag.status === TagStatus.Accepted) {
			await new TagUpdatedPublisher(natsWrapper.client).publish({
				id: tag.id,
				name: tag.name,
				version: tag.version,
			});
		}

		res.status(201).send(tag);
	}
);

export { router as updateTagRouter };
