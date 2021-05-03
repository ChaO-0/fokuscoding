import { Listener, PostCreatedEvent, Subjects } from '@heapoverflow/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
// import { Post } from '../../models/Post';
import { Tag } from '../../models/Tag';

export class PostCreatedListener extends Listener<PostCreatedEvent> {
	readonly subject = Subjects.PostCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: PostCreatedEvent['data'], msg: Message) {
		const {
			id,
			title,
			username,
			tags,
			voteCount,
			commentCount,
			createdAt,
			updatedAt,
		} = data;

		// console.log(tags, id);

		// const post = Post.build({ id, tags });

		// await post.save();

		const tagPosts = await Tag.find({ _id: { $in: tags } });
		// console.log(tagPosts);

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
