import { Listener, Subjects, PostUpdatedEvent } from '@heapoverflow/common';
import { Message } from 'node-nats-streaming';
import { Tag, TagDoc } from '../../models/Tag';
import { queueGroupName } from './queue-group-name';

export class PostUpdatedListener extends Listener<PostUpdatedEvent> {
	readonly subject = Subjects.PostUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: PostUpdatedEvent['data'], msg: Message) {
		const { id, title, body, username, tags, updatedAt, version } = data;

		console.log(id, tags);

		const foundTag = await Tag.find({
			posts: id,
		});

		// console.log('Before Update: ');
		// console.log(foundTag);

		const foundTagAfterUpdate = await Tag.find({
			_id: {
				$in: tags,
			},
		});

		// console.log('After Update: ');
		// console.log(foundTagAfterUpdate);

		console.log('--------------------');

		const foundTagName = (foundTag as TagDoc[]).map((x) => {
			return x.name;
		});

		const foundTagId = (foundTag as TagDoc[]).map((x) => {
			return x._id;
		});

		const foundTagAfterUpdateName = (foundTagAfterUpdate as TagDoc[]).map(
			(x) => {
				return x.name;
			}
		);

		const foundTagAfterUpdateId = (foundTagAfterUpdate as TagDoc[]).map((x) => {
			return x._id;
		});

		console.log(foundTagName);
		console.log(foundTagAfterUpdateName);
		console.log('---------------------');
		console.log(foundTagId);
		console.log(foundTagAfterUpdateId);

		const intersection1 = foundTagName.filter(
			(x) => !foundTagAfterUpdateName.includes(x)
		);

		const intersection2 = foundTagAfterUpdateName.filter(
			(x) => !foundTagName.includes(x)
		);

		console.log('---------------------');
		console.log(intersection1);
		console.log('---------------------');
		console.log(intersection2);

		await Tag.updateMany(
			{
				name: {
					$in: intersection1,
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
					$in: intersection2,
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
