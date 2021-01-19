import { NotFoundError, requireAuth } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Vote } from '../../models/Vote';
import { Post } from '../../models/Post';
import { Comment } from '../../models/Comment';

const router = express.Router();

router.post(
	'/api/posts/:post_id/comment/:comment_id/up',
	requireAuth,
	async (req: Request, res: Response) => {
		const post = await Post.findById(req.params.post_id);
		const comment = await Comment.findById(req.params.comment_id);

		if (!post) {
			throw new NotFoundError();
		}

		if (!comment) {
			throw new NotFoundError();
		}

		// todo soon to be refactored

		const voters = [...comment.votes];
		const alreadyVoted = voters.find((voter) => {
			return voter.username === req.currentUser!.username;
		});

		if (alreadyVoted?.type === 'up') {
			await Vote.findByIdAndDelete(alreadyVoted.id);
			await Comment.updateOne(
				{ _id: req.params.comment_id },
				{ $pull: { votes: alreadyVoted.id } }
			);

			return res.status(204).send(post);
		} else if (alreadyVoted?.type === 'down') {
			const vote = await Vote.findById(alreadyVoted.id);
			vote.set({
				type: 'up',
			});

			await vote.save();

			return res.status(204).send(comment);
		}

		// todo end todo

		const vote = Vote.build({
			type: 'up',
			username: req.currentUser!.username,
		});
		await vote.save();

		comment.votes.push(vote.id);
		await comment.save();

		return res.send(comment);
	}
);

export { router as upvoteCommentRouter };
