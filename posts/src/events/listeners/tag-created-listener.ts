import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TagCreatedEvent } from '@heapoverflow/common';
import { Tag } from '../../models/Tag';
import { queueGroupName } from './queue-group-name';

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

		msg.ack();
	}
}
