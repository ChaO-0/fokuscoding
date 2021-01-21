import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Comment } from '../../models/Comment';
import { Post } from '../../models/Post';

const router = express.Router();

router.delete(
	'/api/posts/:post_id/comment/:comment_id',
	requireAuth,
	async (req: Request, res: Response) => {
		const post = await Post.findById(req.params.post_id);
		const comment = await Comment.findById(req.params.comment_id);

		if (!post) {
			throw new NotFoundError();
		}

		if (!comment) {
			throw new NotFoundError();
		}

		if (req.currentUser!.username !== comment.username) {
			throw new NotAuthorizedError();
		}

		if (!post.comments) {
			throw new NotFoundError();
		}

		comment.remove();

		post.comments.remove(req.params.comment_id);

		return res.status(204).send(comment);
	}
);

export { router as deleteCommentRouter };
