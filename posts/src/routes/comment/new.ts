import {
	NotFoundError,
	requireAuth,
	validateRequest,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Post } from '../../models/Post';
import { Comment } from '../../models/Comment';

const router = express.Router();

router.post(
	'/api/posts/:post_id',
	requireAuth,
	[body('text').not().isEmpty().withMessage('Text is required')],
	validateRequest,
	async (req: Request, res: Response) => {
		// find post by id
		const post = await Post.findById(req.params.post_id);

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

		return res.status(201).send(comment);
	}
);

export { router as newCommentRouter };
