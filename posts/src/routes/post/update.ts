import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
	validateRequest,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Post } from '../../models/Post';

const router = express.Router();

router.put(
	'/api/posts/:post_id',
	requireAuth,
	[
		body('title').not().isEmpty().withMessage('Title is required'),
		body('body').not().isEmpty().withMessage('Body is required'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { title, body, tags } = req.body;

		// find post by id
		const post = await Post.findById(req.params.post_id);

		// check if the post is exist
		if (!post) {
			throw new NotFoundError();
		}

		// check if the post is owned by the user
		if (req.currentUser!.username !== post.username) {
			throw new NotAuthorizedError();
		}

		// edit the title and the body
		post.set({
			title,
			body,
			tags,
		});

		// save the post
		await post.save();

		res.send(post);
	}
);

export { router as updatePostRouter };
