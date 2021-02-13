import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { PostDeletedPublisher } from '../../events/publisher/post-deleted-publisher';
import { Post } from '../../models/Post';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.delete(
	'/api/posts/:post_id',
	requireAuth,
	async (req: Request, res: Response) => {
		const { post_id } = req.params;
		// find post by Id
		const post = await Post.findById(post_id);

		// make sure if the post is exist
		if (!post) {
			throw new NotFoundError();
		}

		// make sure if the post is made by the user or is an admin
		if (
			req.currentUser!.username !== post.username &&
			!req.currentUser!.admin
		) {
			throw new NotAuthorizedError();
		}

		// remove the post
		post.remove();

		await new PostDeletedPublisher(natsWrapper.client).publish({
			id: post.id,
		});

		res.status(204).send(post);
	}
);

export { router as deletePostRouter };
