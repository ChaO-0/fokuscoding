import { Listener, Subjects, PostUpdatedEvent } from '@heapoverflow/common';
import { Message } from 'node-nats-streaming';
import { Tag, TagDoc } from '../../models/Tag';
import { queueGroupName } from './queue-group-name';

export class PostUpdatedListener extends Listener<PostUpdatedEvent> {
	readonly subject = Subjects.PostUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: PostUpdatedEvent['data'], msg: Message) {
		const { id, tags } = data;

		const foundTag = await Tag.find({
			posts: id,
		});

		const foundTagAfterUpdate = await Tag.find({
			_id: {
				$in: tags,
			},
		});

		const foundTagName = (foundTag as TagDoc[]).map((x) => {
			return x.name;
		});

		const foundTagAfterUpdateName = (foundTagAfterUpdate as TagDoc[]).map(
			(x) => {
				return x.name;
			}
		);

		const diff1 = foundTagName.filter(
			(x) => !foundTagAfterUpdateName.includes(x)
		);

		const diff2 = foundTagAfterUpdateName.filter(
			(x) => !foundTagName.includes(x)
		);

		await Tag.updateMany(
			{
				name: {
					$in: diff1,
				},
			},
			{
				$pull: {
					posts: id,
				},
			}
		);

		await Tag.updateMany(
			{
				name: {
					$in: diff2,
				},
			},
			{
				$push: {
					posts: id,
				},
			}
		);

		msg.ack();
	}
}
