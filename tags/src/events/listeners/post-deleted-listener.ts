import { Listener, PostDeletedEvent, Subjects } from '@heapoverflow/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Post } from '../../models/Post';
import { Tag } from '../../models/Tag';

export class PostDeletedListener extends Listener<PostDeletedEvent> {
	readonly subject = Subjects.PostDeleted;
	queueGroupName = queueGroupName;

	async onMessage(data: PostDeletedEvent['data'], msg: Message) {
		const { id, tags } = data;

		await Tag.updateMany(
			{ _id: { $in: tags } },
			{
				$pull: {
					posts: id,
				},
			}
		);

		msg.ack();
	}
}
