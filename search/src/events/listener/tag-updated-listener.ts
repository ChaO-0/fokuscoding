import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TagUpdatedEvent } from '@heapoverflow/common';
import { Tag } from '../../models/Tag';
import { queueGroupName } from './queue-group-name';

export class TagUpdatedListener extends Listener<TagUpdatedEvent> {
	readonly subject = Subjects.TagUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: TagUpdatedEvent['data'], msg: Message) {
		const { id, name, version } = data;

		const tag = await Tag.findByEvent({ id, version });

		if (!tag) {
			throw new Error('Tag not found');
		}

		tag.set({
			name,
		});

		await tag.save();

		msg.ack();
	}
}
