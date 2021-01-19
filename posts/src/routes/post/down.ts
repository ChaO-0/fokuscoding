import {
	BadRequestError,
	NotFoundError,
	requireAuth,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Post } from '../../models/Post';
import { Vote } from '../../models/Vote';

const router = express.Router();

router.post(
	'/api/posts/:post_id/down',
	requireAuth,
	async (req: Request, res: Response) => {
		const post = await Post.findById(req.params.post_id).populate('votes');

		if (!post) {
			throw new NotFoundError();
		}

		// todo soon to be refactored
		const voters = [...post.votes];
		const alreadyVoted = voters.find((voter) => {
			return voter.username === req.currentUser!.username;
		});

		if (alreadyVoted?.type === 'down') {
			await Vote.findByIdAndDelete(alreadyVoted.id);
			await Post.updateOne(
				{ _id: req.params.post_id },
				{ $pull: { votes: alreadyVoted.id } }
			);

			return res.status(204).send(post);
		} else if (alreadyVoted?.type === 'up') {
			const vote = await Vote.findById(alreadyVoted.id);
			vote.set({
				type: 'down',
			});

			await vote.save();

			return res.status(204).send(post);
		}

		// todo entodo
		const vote = Vote.build({
			type: 'down',
			username: req.currentUser!.username,
		});
		await vote.save();

		post.votes.push(vote.id);
		await post.save();

		return res.send(post);
	}
);

export { router as downvotePostRouter };
