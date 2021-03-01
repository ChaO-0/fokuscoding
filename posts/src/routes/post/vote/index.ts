import { requireAuth, validateRequest } from '@heapoverflow/common';
import { body } from 'express-validator';
import express, { Request, Response } from 'express';
import { VoteUpdatedPublisher } from '../../../events/publishers/vote-count-updated-publisher';
import { Post, PostDoc } from '../../../models/Post';
import { Vote, VoteDoc } from '../../../models/Vote';
import { natsWrapper } from '../../../nats-wrapper';
import { VoteType } from './vote-type';
import { voting } from './voting';

const router = express.Router();

router.post(
	'/api/posts/:post_id/vote',
	requireAuth,
	[
		body('voteType')
			.not()
			.isEmpty()
			.matches(/\b(?:up|down)\b/)
			.withMessage('something went wrong'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { voteType } = req.body;

		const { status, data } = await voting(req, res, voteType);
		const post: PostDoc = await Post.findById(req.params.post_id);

		const postVote = post!.votes;

		const votes: VoteDoc[] = await Vote.find({
			_id: {
				$in: postVote,
			},
		});

		const upVote = votes.filter((vote) => vote.type === VoteType.Up).length;
		const downVote = votes.filter((vote) => vote.type === VoteType.Down).length;

		const countVote = upVote - downVote;

		await new VoteUpdatedPublisher(natsWrapper.client).publish({
			postId: post!._id,
			voteCount: countVote,
			updatedAt: post.updatedAt,
			version: post!.version,
		});

		return res.status(status).send({ data, countVote });
	}
);

export { router as votePostRouter };
