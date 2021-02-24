import {
	NotFoundError,
	requireAuth,
	validateRequest,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Post } from '../../models/Post';
import { Tag, TagDoc } from '../../models/Tag';
import { natsWrapper } from '../../nats-wrapper';
import { PostCreatedPublisher } from '../../events/publishers/post-created-publisher';
const router = express.Router();

router.post(
	'/api/posts',
	requireAuth,
	[
		body('title').not().isEmpty().withMessage('Title is Required'),
		body('body').not().isEmpty().withMessage('Body is required'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { title, body } = req.body;

		let tags: TagDoc[] = await Tag.find({
			_id: {
				$in: req.body.tags,
			},
		});

		if (!tags) {
			tags = [];
		}

		const username = req.currentUser!.username;

		const post = Post.build({ title, body, username, tags });
		await post.save();

		let tagList: string[] | undefined = post.tags?.map((tag) => tag.id);
		if (!tagList) {
			tagList = [];
		}

		//publisher event to nats streaming server
		await new PostCreatedPublisher(natsWrapper.client).publish({
			id: post.id,
			title: post.title,
			voteCount: 0,
			username: post.username,
			tags: tagList,
			commentCount: 0,
			createdAt: post.createdAt,
			updatedAt: post.updatedAt,
		});

		res.status(201).send(post);
	}
);

export { router as newPostRouter };
