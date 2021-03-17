import { Listener, TagCreatedEvent, Subjects } from '@heapoverflow/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Tag } from '../../models/Tag';

export class TagCreatedListener extends Listener<TagCreatedEvent> {
	readonly subject = Subjects.TagCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: TagCreatedEvent['data'], msg: Message) {
		const { id, name } = data;
		const tag = Tag.build({
			id,
			name,
		});
		await tag.save();

		// console.log(tag);

		msg.ack();
	}
}
