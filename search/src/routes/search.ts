import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Post } from '../models/Post';

const router = express.Router();

router.post('/api/search', async (req: Request, res: Response) => {
	const { query } = req.body;
	const search = await Post.find({
		title: {
			$regex: `.*${query}.*`,
			$options: 'i',
		},
	});

	console.log(search);

	console.log(query);

	return res.send(search);
});

export { router as SearchRouter };
