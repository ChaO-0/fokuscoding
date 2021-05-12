import express, { Request, Response } from 'express';
import { Post } from '../../models/Post';
import { Tag } from '../../models/Tag';
const router = express.Router();

router.get('/api/posts', async (req: Request, res: Response) => {
	const limit = parseInt(req.query.limit as string);
	const offset = parseInt(req.query.offset as string);
	const username = req.query.username as string;
	const has_tags = req.query.tags as string;

	let tags = await Tag.find({
		name: has_tags,
	});

	let posts = await Post.paginate(
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
	}
	if (has_tags) {
		posts = await Post.paginate(
			{
				tags: {
					$in: tags,
				},
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
	}
	// else if (has_tags) {
	// 	if (offset || limit) {
	// 		posts = await Post.paginate(
	// 			{
	// 				tags: {
	// 					$in: tags,
	// 				},
	// 			},
	// 			{
	// 				populate: ['votes', 'comments', 'tags'],
	// 				offset: offset || 0,
	// 				limit: limit || 10,
	// 				sort: {
	// 					updatedAt: 'desc',
	// 				},
	// 			}
	// 		);
	// 	} else {
	// 		posts = await Post.find({
	// 			tags: {
	// 				$in: tags,
	// 			},
	// 		})
	// 			.populate('tags')
	// 			.sort({ updatedAt: 'desc' });

	// 		posts = { postLength: posts.length };

	// 		console.log(posts);
	// 	}
	// } else {
	// 	posts = await Post.paginate(
	// 		{},
	// 		{
	// 			populate: ['votes', 'comments', 'tags'],
	// 			offset: offset || 0,
	// 			limit: limit || 10,
	// 			sort: {
	// 				updatedAt: 'desc',
	// 			},
	// 		}
	// 	);
	// }

	res.status(200).send(posts);
});

export { router as indexPostRouter };
