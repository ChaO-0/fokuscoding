import express, { Request, Response } from 'express';
import { Post } from '../../models/Post';

const router = express.Router();

router.get('/api/posts', async (req: Request, res: Response) => {
	const posts = await Post.find().populate('comments').populate('votes');

	res.send({ posts });
});

export { router as indexPostRouter };
