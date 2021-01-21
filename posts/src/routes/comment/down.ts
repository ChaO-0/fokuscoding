import { NotFoundError, requireAuth } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Vote } from '../../models/Vote';
import { Comment } from '../../models/Comment';

const router = express.Router();

router.post(
	'/api/posts/comment/:comment_id/down',
	requireAuth,
	async (req: Request, res: Response) => {
		const comment = await Comment.findById(req.params.comment_id);

		if (!comment) {
			throw new NotFoundError();
		}

		// todo soon to be refactored

		const voters = [...comment.votes];
		const alreadyVoted = voters.find((voter) => {
			return voter.username === req.currentUser!.username;
		});

		if (alreadyVoted?.type === 'down') {
			await Vote.findByIdAndDelete(alreadyVoted.id);
			await Comment.updateOne(
				{ _id: req.params.comment_id },
				{ $pull: { votes: alreadyVoted.id } }
			);

			return res.status(204).send(comment);
		} else if (alreadyVoted?.type === 'up') {
			const vote = await Vote.findById(alreadyVoted.id);
			vote.set({
				type: 'down',
			});

			await vote.save();

			return res.status(204).send(comment);
		}

		// todo end todo

		const vote = Vote.build({
			type: 'down',
			username: req.currentUser!.username,
		});
		await vote.save();

		comment.votes.push(vote.id);
		await comment.save();

		return res.send(comment);
	}
);

export { router as downvoteCommentRouter };
