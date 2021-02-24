import express, { Request, Response } from 'express';
import { Post } from '../../models/Post';

const router = express.Router();

router.get('/api/posts', async (req: Request, res: Response) => {
	const limit: number = parseInt(req.query.limit as string);
	const offset: number = parseInt(req.query.offset as string);

	const posts = await Post.paginate(
		{},
		{
			populate: ['votes', 'comments', 'tags'],
			offset: offset || 0,
			limit: limit || 10,
		}
	);

	res.send(posts);
});

export { router as indexPostRouter };
