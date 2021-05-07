import { NotFoundError } from '@heapoverflow/common';
import { Request, Response } from 'express';
import { CommentDoc } from '../models/Comment';
import { PostDoc } from '../models/Post';
import { Vote, VoteDoc } from '../models/Vote';

import { VoteType } from './vote-type';

interface IVote {
	status: number;
	data: PostDoc | CommentDoc;
}

const voting = async (
	req: Request,
	voteType: string,
	doc?: PostDoc | CommentDoc
): Promise<IVote> => {
	const voteOpp = voteType === VoteType.Down ? VoteType.Up : VoteType.Down;

	if (!doc) {
		throw new NotFoundError();
	}

	// find out if the user has voted
	const alreadyVoted = (doc.votes as VoteDoc[]).find((voter) => {
		return voter.username === req.currentUser!.username;
	});

	// check the type of the vote if the user is already voted
	if (alreadyVoted?.type === voteType) {
		// find vote by id
		const vote: VoteDoc = await Vote.findById(alreadyVoted.id);
		// remove the vote
		vote!.remove();

		// remove the vote from the post
		(doc.votes as VoteDoc).remove(alreadyVoted.id);
		// save the post
		// ? .remove() is for TOP-LEVEL documents
		// ? because we used .remove() for the the sub document, we have to use .save()
		// ? to save the TOP-LEVEL document
		// ? ref: https://stackoverflow.com/questions/18553946/remove-sub-document-from-mongo-with-mongoose
		await doc.save();

		return { status: 204, data: doc };
	} else if (alreadyVoted?.type === voteOpp) {
		// find vote by id
		const vote: VoteDoc = await Vote.findById(alreadyVoted.id);
		// update the type of the vote
		vote!.set({
			type: voteType,
		});
		// save the vote
		await vote!.save();

		await doc.save();
		return { status: 204, data: doc };
	}

	// build down the vote if the user has not voted
	const vote = Vote.build({
		type: voteType,
		username: req.currentUser!.username,
	});
	// save the vote
	await vote.save();

	// push the vote to the post document
	(doc.votes as VoteDoc[]).push(vote.id);
	// save the post
	await doc.save();

	return { status: 201, data: doc };
};

export { voting };
