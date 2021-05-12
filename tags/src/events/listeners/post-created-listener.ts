import { Listener, PostCreatedEvent, Subjects } from '@heapoverflow/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Tag } from '../../models/Tag';

export class PostCreatedListener extends Listener<PostCreatedEvent> {
	readonly subject = Subjects.PostCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: PostCreatedEvent['data'], msg: Message) {
		const { id, tags } = data;

		await Tag.updateMany(
			{ _id: { $in: tags } },
			{
				$push: {
					posts: id,
				},
			}
		);

		msg.ack();
	}
}
