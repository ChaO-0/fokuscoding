import { Listener, Subjects, PostDeletedEvent } from '@heapoverflow/common';
import { Message } from 'node-nats-streaming';
import { Post } from '../../models/Post';
import { queueGroupName } from './queue-group-name';

export class PostDeletedListener extends Listener<PostDeletedEvent> {
	readonly subject = Subjects.PostDeleted;
	queueGroupName = queueGroupName;

	async onMessage(data: PostDeletedEvent['data'], msg: Message) {
		const { id } = data;

		const post = await Post.findById(id);

		if (!post) {
			throw new Error('Post Not Found');
		}
		post.remove();

		msg.ack();
	}
}
