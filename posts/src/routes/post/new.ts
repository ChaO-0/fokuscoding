import {
	NotFoundError,
	requireAuth,
	validateRequest,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Post } from '../../models/Post';
import { Tag } from '../../models/Tag';

const router = express.Router();

router.post(
	'/api/posts',
	requireAuth,
	[
		body('title').not().isEmpty().withMessage('Title is Required'),
		body('body').not().isEmpty().withMessage('Body is required'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { title, body } = req.body;

		let tags = await Tag.find({
			_id: {
				$in: req.body.tags,
			},
		});

		if (!tags) {
			tags = [];
		}

		const username = req.currentUser!.username;

		const post = Post.build({ title, body, username, tags });
		await post.save();
		// console.log('New discussion created :)');

		res.status(201).send(post);
	}
);

export { router as newPostRouter };
