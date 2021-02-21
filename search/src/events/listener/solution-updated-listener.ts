import { Listener, SolutionUpdatedEvent, Subjects } from '@heapoverflow/common';
import { Message } from 'node-nats-streaming';
import { Post } from '../../models/Post';
import { queueGroupName } from './queue-group-name';

export class SolutionUpdatedListener extends Listener<SolutionUpdatedEvent> {
	readonly subject = Subjects.SolutionUpdated;

	queueGroupName = queueGroupName;

	async onMessage(data: SolutionUpdatedEvent['data'], msg: Message) {
		const { postId, hasSolution, updatedAt, version } = data;

		const post = await Post.findByEvent({ id: postId, version });

		if (!post) {
			throw new Error('Post Not Found');
		}

		post.set({
			hasSolution,
			updatedAt,
		});

		await post.save();

		msg.ack();
	}
}
