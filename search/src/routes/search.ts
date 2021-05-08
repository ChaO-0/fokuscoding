import { validateRequest } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Post } from '../models/Post';
import { Tag } from '../models/Tag';

const router = express.Router();

router.post('/api/search', async (req: Request, res: Response) => {
	const { query, tags } = req.body;

	let search: [] = [];

	// if tags and query post parameter is not empty
	if (tags && query) {
		const alikeTags = await Tag.find({
			name: {
				$in: tags,
			},
		});

		search = await Post.find({
			$and: [
				{
					title: {
						$regex: `.*${query}.*`,
						$options: 'i',
					},
					tags: {
						$in: alikeTags,
					},
				},
			],
		})
			.sort({ updatedAt: -1 })
			.populate('tags');

		return res.send(search);
	}

	// if tags parameter is empty and query parameter is not empty
	if (!tags && query) {
		search = await Post.find({
			title: {
				$regex: `.*${query}.*`,
				$options: 'i',
			},
		})
			.sort({ updatedAt: -1 })
			.populate('tags');

		return res.send(search);
	}

	// if tags parameter is not empty and query post parameter is empty
	if (tags && !query) {
		const alikeTags = await Tag.find({
			name: {
				$in: tags,
			},
		});

		search = await Post.find({
			tags: {
				$in: alikeTags,
			},
		})
			.sort({ updatedAt: -1 })
			.populate('tags');

		return res.send(search);
	}

	return res.send(search);
});

export { router as SearchRouter };
