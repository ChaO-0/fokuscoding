import { requireAuth } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Tag } from '../models/Tag';

const router = express.Router();

router.post(
	'/api/tags',
	requireAuth,
	[body('tag').not().isEmpty().withMessage('Tag is required')],
	async (req: Request, res: Response) => {
		const tag = Tag.build({
			name: req.body.name,
		});

		await tag.save();

		return res.status(201).send(tag);
	}
);

export { router as indexRouter };
