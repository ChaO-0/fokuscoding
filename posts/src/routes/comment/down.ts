import { NotFoundError, requireAuth } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Vote } from '../../models/Vote';
import { Comment } from '../../models/Comment';

const router = express.Router();

router.post(
	'/api/posts/comment/:comment_id/down',
	requireAuth,
	async (req: Request, res: Response) => {
		// find comment by id
		const comment = await Comment.findById(req.params.comment_id);

		// check if the comment is exist
		if (!comment) {
			throw new NotFoundError();
		}

		// copy the votes subdocument as a plain js array
		const voters = [...comment.votes];
		// find out if the user has voted
		const alreadyVoted = voters.find((voter) => {
			return voter.username === req.currentUser!.username;
		});

		// check the typ of the vote
		if (alreadyVoted?.type === 'down') {
			// find vote by id
			const vote = Vote.findById(alreadyVoted.id);
			// remove the vote
			vote.remove();

			// remove the votes subdocument from the comment document
			comment.votes.remove(alreadyVoted.id);
			// save the comment
			await comment.save();

			return res.status(204).send(comment);
		} else if (alreadyVoted?.type === 'up') {
			// find vote by id
			const vote = await Vote.findById(alreadyVoted.id);
			// updates the type of the vote
			vote.set({
				type: 'down',
			});

			// save the vote
			await vote.save();

			return res.status(204).send(comment);
		}

		// if the checks are passed
		// build up a vote
		const vote = Vote.build({
			type: 'down',
			username: req.currentUser!.username,
		});
		// save the vote
		await vote.save();

		// push the vote to the comment document
		comment.votes.push(vote.id);
		// save the comment
		await comment.save();

		return res.status(201).send(comment);
	}
);

export { router as downvoteCommentRouter };
