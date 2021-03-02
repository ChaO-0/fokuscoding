import { requireAuth, validateRequest } from '@heapoverflow/common';
import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import { Comment } from '../../models/Comment';
import { voting } from '../../utils/voting';

const router = express.Router();

router.post(
	'/api/posts/comment/:comment_id/vote',
	requireAuth,
	[
		body('voteType')
			.not()
			.isEmpty()
			.matches(/\b(?:up|down)\b/)
			.withMessage('something went wrong'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { voteType } = req.body;

		// find comment by id
		const doc = await Comment.findById(req.params.comment_id);

		const { status, data } = await voting(req, voteType, doc);
		return res.status(status).send(data);
	}
);

export { router as voteCommentRouter };
