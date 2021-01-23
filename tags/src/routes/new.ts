import { requireAuth } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { TagStatus } from '../types/tag-status';
import { Tag } from '../models/Tag';

const router = express.Router();

router.post(
	'/api/tags',
	requireAuth,
	[body('tag').not().isEmpty().withMessage('Tag is required')],
	async (req: Request, res: Response) => {
		const { name } = req.body;
		const isAdmin = req.currentUser!.admin;
		const status = isAdmin ? TagStatus.Accepted : TagStatus.Awaiting;

		const tag = Tag.build({
			name,
			status,
		});

		await tag.save();

		res.status(201).send(tag);
	}
);

export { router as newTagRouter };
