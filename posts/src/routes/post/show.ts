import { NotFoundError } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Post, PostDoc } from '../../models/Post';

const router = express.Router();

router.get('/api/posts/:post_id', async (req: Request, res: Response) => {
	// find post by id
	const post = await Post.findById(req.params.post_id)
		.populate('votes')
		.populate('comments')
		.populate('tags')
		.populate('solution');

	// check if the post is exist
	if (!post) {
		throw new NotFoundError();
	}

	res.send(post);
});

export { router as showPostRouter };
