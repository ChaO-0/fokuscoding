import {
	Listener,
	Subjects,
	CommentCountUpdatedEvent,
} from '@heapoverflow/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Post } from '../../models/Post';

export class CommentCountUpdatedListener extends Listener<CommentCountUpdatedEvent> {
	readonly subject = Subjects.CommentUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: CommentCountUpdatedEvent['data'], msg: Message) {
		const { postId, version, commentCount, updatedAt } = data;

		const post = await Post.findByEvent({
			id: postId,
			version,
		});

		if (!post) {
			throw new Error('Post Not Found!');
		}
		post.set({
			commentCount,
			updatedAt,
		});

		await post.save();

		msg.ack();
	}
}
