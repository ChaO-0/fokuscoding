import {
	NotFoundError,
	requireAuth,
	validateRequest,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Post, PostDoc } from '../../models/Post';
import { Comment } from '../../models/Comment';
import { CommentCountUpdatedPublisher } from '../../events/publishers/comment-count-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.post(
	'/api/posts/:post_id',
	requireAuth,
	[body('text').not().isEmpty().withMessage('Text is required')],
	validateRequest,
	async (req: Request, res: Response) => {
		// find post by id
		const post: PostDoc = await Post.findById(req.params.post_id);
		// const comments = post.comments as CommentDoc;

		// check if the post is exist
		if (!post) {
			throw new NotFoundError();
		}

		// build the comment if the post is exist
		const comment = Comment.build({
			text: req.body.text,
			username: req.currentUser!.username,
		});
		// save the comment
		await comment.save();

		// push the comment id to the post
		post.comments.push(comment.id);
		// save the post
		await post.save();

		console.log(post.comments.length);

		await new CommentCountUpdatedPublisher(natsWrapper.client).publish({
			postId: post._id,
			commentCount: post.comments.length,
			updatedAt: post.updatedAt,
			version: post.version,
		});

		return res.status(201).send(comment);
	}
);

export { router as newCommentRouter };
