import { Post } from '../models/Post';

import { PostCreatedPublisher } from '../events/publishers/post-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const dbSeeder = async () => {
	const data = await Post.find().exec();
	if (data.length === 0) {
		for (let i = 0; i < 50; i++) {
			const seed = Post.build({
				title: `Lorem Ipsum Dolor Sit Amet ${i + 1}`,
				body:
					"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
				username: 'fajar',
			});
			await seed.save();
			await new PostCreatedPublisher(natsWrapper.client).publish({
				id: seed.id,
				title: seed.title,
				voteCount: 0,
				username: seed.username,
				tags: [],
				commentCount: 0,
				createdAt: seed.createdAt,
				updatedAt: seed.updatedAt,
			});
		}

		console.log('success add data!');
	}
};

export { dbSeeder };
