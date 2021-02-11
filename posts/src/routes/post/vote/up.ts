import { NotFoundError, requireAuth } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Post } from '../../../models/Post';
import { Vote, VoteDoc } from '../../../models/Vote';

const router = express.Router();

const Voting = async (req: Request, res: Response) => {
	// find the post by id
	const post = await Post.findById(req.params.post_id).populate('votes');

	// check if the post is exist
	if (!post) {
		throw new NotFoundError();
	}

	// copy the votes array from the post
	// we copy the votes for the "find" function in js plain object
	// not as a mongoose model

	const voters = [...(post.votes as VoteDoc[])];
	// find out if the current user has voted
	const alreadyVoted = voters.find((voter) => {
		return voter.username === req.currentUser!.username;
	});

	// check the type of the user's vote
	if (alreadyVoted?.type === 'up') {
		// find vote by id
		const vote = await Vote.findById(alreadyVoted.id);
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
	} else if (alreadyVoted?.type === 'down') {
		// find vote by id
		const vote = await Vote.findById(alreadyVoted.id);
		// set the vote type to up
		vote!.set({
			type: 'up',
		});

		// save the vote;
		await vote!.save();

		return { status: 204, data: post };
	}

	// build the vote if the user has not voted
	const vote = Vote.build({
		type: 'up',
		username: req.currentUser!.username,
	});
	// save the vote
	await vote.save();

	// push the vote to the votes array in post document
	(post.votes as VoteDoc[]).push(vote.id);
	// save the post
	await post.save();

	return { status: 201, data: post };
};

router.post(
	'/api/posts/:post_id/up',
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

		return res.status(status).send({ data, countVote });
	}
);

export { router as upvotePostRouter };
