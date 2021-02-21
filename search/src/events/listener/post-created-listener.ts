import { Listener, PostCreatedEvent, Subjects } from '@heapoverflow/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Post } from '../../models/Post';

export class PostCreatedListener extends Listener<PostCreatedEvent> {
	readonly subject = Subjects.PostCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: PostCreatedEvent['data'], msg: Message) {
		const {
			id,
			title,
			username,
			tags,
			voteCount,
			commentCount,
			createdAt,
			updatedAt,
		} = data;

		const post = Post.build({
			id,
			title,
			username,
			tags,
			voteCount,
			commentCount,
			createdAt,
			updatedAt,
		});

		await post.save();

		msg.ack();
	}
}
