import express, { Request, Response } from 'express';
import { Post } from '../../models/Post';

const router = express.Router();

router.get('/api/posts', async (req: Request, res: Response) => {
	const limit: number = parseInt(req.query.limit as string);
	const offset: number = parseInt(req.query.offset as string);
	const username: string = req.query.username as string;

	let posts;
	if (username) {
		posts = await Post.paginate(
			{
				username,
			},
			{
				populate: ['votes', 'comments', 'tags'],
				offset: offset || 0,
				limit: limit || 10,
				sort: {
					updatedAt: 'desc',
				},
			}
		);
	} else {
		posts = await Post.paginate(
			{},
			{
				populate: ['votes', 'comments', 'tags'],
				offset: offset || 0,
				limit: limit || 10,
				sort: {
					updatedAt: 'desc',
				},
			}
		);
	}

	res.send(posts);
});

export { router as indexPostRouter };
