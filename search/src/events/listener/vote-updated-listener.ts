import {
	Listener,
	NotFoundError,
	Subjects,
	VoteUpdatedEvent,
} from '@heapoverflow/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Post } from '../../models/Post';

export class VoteUpdatedListener extends Listener<VoteUpdatedEvent> {
	readonly subject = Subjects.VoteUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: VoteUpdatedEvent['data'], msg: Message) {
		const { id, vote, version } = data;

		const post = await Post.findByEvent({
			id,
			version: version,
		});

		if (!post) {
			throw new NotFoundError();
		}

		post.set({ vote });

		await post.save();

		msg.ack();
	}
}
