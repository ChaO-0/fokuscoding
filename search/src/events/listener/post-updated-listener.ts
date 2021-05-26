import { Listener, Subjects, PostUpdatedEvent } from '@heapoverflow/common';
import { Message } from 'node-nats-streaming';
import { Post } from '../../models/Post';
import { queueGroupName } from './queue-group-name';

export class PostUpdatedListener extends Listener<PostUpdatedEvent> {
	readonly subject = Subjects.PostUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: PostUpdatedEvent['data'], msg: Message) {
		const { id, title, body, username, tags, updatedAt, version } = data;

		const post = await Post.findByEvent({
			id,
			version,
		});
		if (!post) {
			throw new Error('Post Not Found');
		}

		post.set({
			title,
			username,
			tags,
			updatedAt,
		});

		await post.save();

		msg.ack();
	}
}
