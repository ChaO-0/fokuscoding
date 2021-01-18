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

		await Comment.findByIdAndDelete(req.params.comment_id);
		await Post.updateOne(
			{ _id: req.params.post_id },
			{ $pull: { comments: req.params.comment_id } }
		);

		return res.status(204);
	}
);

export { router as deleteCommentRouter };
