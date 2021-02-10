import {
	NotFoundError,
	requireAuth,
	validateRequest,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Post } from '../../models/Post';
import { Tag } from '../../models/Tag';
import { natsWrapper } from '../../nats-wrapper';
import { PostCreatedPublisher } from '../../events/publisher/post-created-publisher';
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

		let tags = await Tag.find({
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

		let tagList = post.tags?.map((tag) => tag.name);
		if (!tagList) {
			tagList = [];
		}

		//publisher event to nats streaming server
		await new PostCreatedPublisher(natsWrapper.client).publish({
			id: post.id,
			title: post.title,
			votes: 0,
			username: post.username,
			tags: tagList,
		});

		res.status(201).send(post);
	}
);

export { router as newPostRouter };
