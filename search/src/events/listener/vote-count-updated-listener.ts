import {
	Listener,
	Subjects,
	VoteUpdatedCountEvent,
} from '@heapoverflow/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Post } from '../../models/Post';

export class VoteCountUpdatedListener extends Listener<VoteUpdatedCountEvent> {
	readonly subject = Subjects.VoteUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: VoteUpdatedCountEvent['data'], msg: Message) {
		const { postId, voteCount, updatedAt, version } = data;

		const post = await Post.findByEvent({
			id: postId,
			version,
		});

		if (!post) {
			throw new Error('Vote Not Found!');
		}

		post.set({ voteCount: voteCount, updatedAt });

		await post.save();

		msg.ack();
	}
}
