import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Post } from '../../models/Post';

const router = express.Router();

router.delete(
	'/api/posts/:post_id',
	requireAuth,
	async (req: Request, res: Response) => {
		const { post_id } = req.params;
		// find post by Id
		const post = await Post.findById(post_id);

		// check if the post is exist
		if (!post) {
			throw new NotFoundError();
		}

		// check if the post is made by the user
		if (req.currentUser!.username !== post.username) {
			throw new NotAuthorizedError();
		}

		// remove the post
		post.remove();

		res.status(204).send(post);
	}
);

export { router as deletePostRouter };
