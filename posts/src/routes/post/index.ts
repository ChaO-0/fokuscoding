import express, { Request, Response } from 'express';
import { Post } from '../../models/Post';
import { Tag, TagDoc } from '../../models/Tag';
const router = express.Router();

router.get('/api/posts', async (req: Request, res: Response) => {
	const limit: number = parseInt(req.query.limit as string);
	const offset: number = parseInt(req.query.offset as string);
	const username: string = req.query.username as string;
	const has_tags: string = req.query.tags as string;

	let tags: TagDoc[] = await Tag.find({
		name: has_tags,
	});

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
	} else if (has_tags) {
		if (offset || limit) {
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
		} else {
			posts = await Post.find({
				tags: {
					$in: tags,
				},
			})
				.populate('tags')
				.sort({ updatedAt: 'desc' });

			posts = { postLength: posts.length };

			console.log(posts);
		}
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

	res.status(200).send(posts);
});

export { router as indexPostRouter };
