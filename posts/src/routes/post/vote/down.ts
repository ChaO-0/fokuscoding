import {
	BadRequestError,
	NotFoundError,
	requireAuth,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Post } from '../../../models/Post';
import { Vote, VoteDoc } from '../../../models/Vote';

import { natsWrapper } from '../../../nats-wrapper';
import { VoteUpdatedPublisher } from '../../../events/publisher/vote-updated-publisher';

const router = express.Router();

const Voting = async (req: Request, res: Response) => {
	// find post by id
	const post = await Post.findById(req.params.post_id).populate('votes');

	// check if the post is exist
	if (!post) {
		throw new NotFoundError();
	}

	// copy the document as a plain array of objects
	// we copy the votes for the "find" function in js plain object
	// not as a mongoose model
	const voters = [...(post.votes as VoteDoc[])];
	// find out if the user has voted
	const alreadyVoted = voters.find((voter) => {
		return voter.username === req.currentUser!.username;
	});

	// check the type of the vote if the user is already voted
	if (alreadyVoted?.type === 'down') {
		// find vote by id
		const vote = Vote.findById(alreadyVoted.id);
		// remove the vote
		vote!.remove();

		// remove the vote from the post
		(post.votes as VoteDoc).remove(alreadyVoted.id);
		// save the post
		// ? .remove() is for TOP-LEVEL documents
		// ? because we used .remove() for the the sub document, we have to use .save()
		// ? to save the TOP-LEVEL document
		// ? ref: https://stackoverflow.com/questions/18553946/remove-sub-document-from-mongo-with-mongoose
		await post.save();

		return { status: 204, data: post };
	} else if (alreadyVoted?.type === 'up') {
		// find vote by id
		const vote = await Vote.findById(alreadyVoted.id);
		// update the type of the vote
		vote!.set({
			type: 'down',
		});
		// save the vote
		await vote!.save();

		await post.save();
		return { status: 204, data: post };
	}

	// build down the vote if the user has not voted
	const vote = Vote.build({
		type: 'down',
		username: req.currentUser!.username,
	});
	// save the vote
	await vote.save();

	// push the vote to the post document
	(post.votes as VoteDoc[]).push(vote.id);
	// save the post
	await post.save();

	return { status: 201, data: post };
};

router.post(
	'/api/posts/:post_id/down',
	requireAuth,
	async (req: Request, res: Response) => {
		const { status, data } = await Voting(req, res);
		const post = await Post.findById(req.params.post_id);

		const postVote = post!.votes;

		const votes: VoteDoc[] = await Vote.find({
			_id: {
				$in: postVote,
			},
		});

		const upVote = votes.filter((vote) => vote.type === 'up').length;
		const downVote = votes.filter((vote) => vote.type === 'down').length;

		const countVote = upVote - downVote;

		await new VoteUpdatedPublisher(natsWrapper.client).publish({
			id: post!._id,
			vote: countVote,
			version: post!.version,
		});

		return res.status(status).send({ data, countVote });
	}
);

export { router as downvotePostRouter };
