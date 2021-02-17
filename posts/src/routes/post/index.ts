import express, { Request, Response } from 'express';
import { Post } from '../../models/Post';

const router = express.Router();

router.get('/api/posts', async (req: Request, res: Response) => {
	// fetch all posts
	const posts = await Post.find().populate('tags').populate('votes');
	const { limit, offset } = req.query;

	const count = await Post.estimatedDocumentCount();
	const entries = await Post.find()
		.populate('tags')
		.populate('votes')
		.limit(limit ? parseInt(limit as string) : 0)
		.skip(offset ? parseInt(offset as string) : 0);
	console.log(count);

	return res.send({
		entries,
		limit: req.query.limit,
		offset: req.query.offset,
		total_count: count,
	});
});

export { router as indexPostRouter };
