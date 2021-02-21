import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Comment } from '../../models/Comment';
import { Post } from '../../models/Post';
import { CommentCountUpdatedPublisher } from '../../events/publishers/comment-count-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.delete(
	'/api/posts/:post_id/comment/:comment_id',
	requireAuth,
	async (req: Request, res: Response) => {
		// find post by id
		const post = await Post.findById(req.params.post_id);
		// find comment by id
		const comment = await Comment.findById(req.params.comment_id);

		//  check if the post is exist
		if (!post) {
			throw new NotFoundError();
		}

		// check if the comment is exist
		if (!comment) {
			throw new NotFoundError();
		}

		// check if the user owns the comment or is an admin
		if (
			req.currentUser!.username !== comment.username &&
			!req.currentUser!.admin
		) {
			throw new NotAuthorizedError();
		}

		// check if the post has comments
		if (!post.comments) {
			throw new NotFoundError();
		}

		// remove the comment if we pass through the checks
		comment.remove();

		// remove the comment id from the post
		// post.comments.remove(req.params.comment_id);
		await post.save();

		await new CommentCountUpdatedPublisher(natsWrapper.client).publish({
			postId: post._id,
			commentCount: post.comments.length,
			updatedAt: post.updatedAt,
			version: post.version,
		});

		return res.status(204).send(comment);
	}
);

export { router as deleteCommentRouter };
