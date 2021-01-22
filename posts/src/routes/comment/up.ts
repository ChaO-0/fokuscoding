import { NotFoundError, requireAuth } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Vote } from '../../models/Vote';
import { Comment } from '../../models/Comment';

const router = express.Router();

router.post(
	'/api/posts/comment/:comment_id/up',
	requireAuth,
	async (req: Request, res: Response) => {
		// find comment by id
		const comment = await Comment.findById(req.params.comment_id);

		// check if the comment is exist
		if (!comment) {
			throw new NotFoundError();
		}

		// if the check passed
		// copy votes subdocument to the voters variable as a plain javascript array
		const voters = [...comment.votes];
		// findout if the user has voted
		const alreadyVoted = voters.find((voter) => {
			return voter.username === req.currentUser!.username;
		});

		// check the type of the vote
		if (alreadyVoted?.type === 'up') {
			// find vote by id
			const vote = Vote.findById(alreadyVoted.id);
			// remove the vote from the vote document
			vote.remove();

			// remove the vote from the comment document
			comment.votes.remove(alreadyVoted.id);
			// save the comment
			await comment.save();

			return res.status(204).send(comment);
		} else if (alreadyVoted?.type === 'down') {
			// find vote by id
			const vote = await Vote.findById(alreadyVoted.id);
			// updates the type of the vote
			vote.set({
				type: 'up',
			});

			// save the vote
			await vote.save();

			return res.status(204).send(comment);
		}

		// if we pass through the checks
		// build up a vote
		const vote = Vote.build({
			type: 'up',
			username: req.currentUser!.username,
		});
		// saves the vote
		await vote.save();

		// push the vote to the comment document
		comment.votes.push(vote.id);
		// save the comment
		await comment.save();

		return res.status(201).send(comment);
	}
);

export { router as upvoteCommentRouter };
