import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
	validateRequest,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { SolutionUpdatedPublisher } from '../../events/publishers/solution-updated-publisher';
import { Post, PostDoc } from '../../models/Post';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.post(
	'/api/posts/:post_id/solution',
	requireAuth,
	[body('commentId').not().isEmpty().withMessage('commentId is Required')],
	validateRequest,
	async (req: Request, res: Response) => {
		const { commentId } = req.body;

		const post: PostDoc = await Post.findById(req.params.post_id);

		if (!post) {
			throw new NotFoundError();
		}

		if (post.has_solution === true) {
			post.set({
				has_solution: false,
				solution: null,
			});
			await post.save();
		} else {
			post.set({
				has_solution: true,
				solution: commentId,
			});
			await post.save();
		}

		//publisher event to nats streaming server
		await new SolutionUpdatedPublisher(natsWrapper.client).publish({
			postId: post._id,
			hasSolution: post.has_solution,
			updatedAt: post.updatedAt,
			version: post.version,
		});

		res.status(201).send(post);
	}
);

export { router as solutionRouter };
