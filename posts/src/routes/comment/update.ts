import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
	validateRequest,
} from '@heapoverflow/common';
import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import { Comment } from '../../models/Comment';

const router = express.Router();

router.put(
	'/api/posts/comment/:comment_id',
	requireAuth,
	[body('text').not().isEmpty().withMessage('Text is required')],
	validateRequest,
	async (req: Request, res: Response) => {
		// find comment by id
		const comment = await Comment.findById(req.params.comment_id);

		// check if the comment is exist
		if (!comment) {
			throw new NotFoundError();
		}

		// check if the user owns the comment
		if (req.currentUser!.username !== comment.username) {
			throw new NotAuthorizedError();
		}

		// updates the comment if the check is passed
		comment.set({
			text: req.body.text,
		});

		// save the comment
		await comment.save();

		return res.send(comment);
	}
);

export { router as updateCommentRouter };
