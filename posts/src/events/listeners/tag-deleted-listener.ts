import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TagDeletedEvent } from '@heapoverflow/common';
import { Tag } from '../../models/Tag';
import { queueGroupName } from './queue-group-name';

export class TagDeletedListener extends Listener<TagDeletedEvent> {
	readonly subject = Subjects.TagDeleted;
	queueGroupName = queueGroupName;

	async onMessage(data: TagDeletedEvent['data'], msg: Message) {
		const { id } = data;
		const tag = Tag.findById(id);

		tag.remove();

		msg.ack();
	}
}
