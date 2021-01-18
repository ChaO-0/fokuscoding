import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
	validateRequest,
} from '@heapoverflow/common';
import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import { Comment } from '../../models/Comment';
import { Post } from '../../models/Post';

const router = express.Router();

router.put(
	'/api/posts/:post_id/comment/:comment_id',
	requireAuth,
	[body('text').not().isEmpty().withMessage('Text is required')],
	validateRequest,
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

		comment.set({
			text: req.params.text,
		});

		await comment.save();

		return res.send(comment);
	}
);

export { router as deleteCommentRouter };
