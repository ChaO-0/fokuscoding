import { validateRequest } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Post } from '../models/Post';

const router = express.Router();

router.post(
	'/api/search',
	[
		body('query')
			.isLength({ min: 3 })
			.withMessage('keyword must be 3 characters'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { query } = req.body;
		const search = await Post.find({
			title: {
				$regex: `.*${query}.*`,
				$options: 'i',
			},
		}).populate('tags');

		return res.send(search);
	}
);

export { router as SearchRouter };
