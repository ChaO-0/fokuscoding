import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
	validateRequest,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { PostUpdatedPublisher } from '../../events/publishers/post-updated-publisher';
import { Post, PostDoc } from '../../models/Post';
import { Tag, TagDoc } from '../../models/Tag';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.put(
	'/api/posts/:post_id',
	requireAuth,
	[
		body('title').not().isEmpty().withMessage('Title is required'),
		body('body').not().isEmpty().withMessage('Body is required'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { title, body, tags } = req.body;

		// find post by id
		const post: PostDoc = await Post.findById(req.params.post_id);
		// check if the post is exist
		if (!post) {
			throw new NotFoundError();
		}

		// check if the post is owned by the user
		if (req.currentUser!.username !== post.username) {
			throw new NotAuthorizedError();
		}

		// edit the title and the body
		post.set({
			title,
			body,
			tags,
		});

		// save the post
		await post.save();
		let postTag: TagDoc[] = await Tag.find({
			_id: {
				$in: tags,
			},
		});

		let tagList: string[] = postTag.map((tag) => tag.id);

		await new PostUpdatedPublisher(natsWrapper.client).publish({
			id: post._id,
			title: post.title,
			body: post.body,
			username: post.username,
			tags: tagList,
			updatedAt: post.updatedAt,
			version: post.version,
		});

		res.send(post);
	}
);

export { router as updatePostRouter };
