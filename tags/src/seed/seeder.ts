import { Tag } from '../models/Tag';
import { dataJson, dataJsonAwait } from './data';
import { TagStatus } from '../types/tag-status';

import { TagCreatedPublisher } from '../events/publishers/tag-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const dbSeeder = async () => {
	const data = await Tag.find().exec();
	if (data.length === 0) {
		dataJson.map(async (data) => {
			const seed = Tag.build({
				name: data.name,
				username: data.username,
				status: data.status,
				description: data.description,
			});
			await seed.save();

			seed.set({
				status: TagStatus.Accepted,
				is_active: true,
			});
			await seed.save();

			await new TagCreatedPublisher(natsWrapper.client).publish({
				id: seed.id,
				name: seed.name,
			});
		});
		dataJsonAwait.map(async (data) => {
			const seed = Tag.build({
				name: data.name,
				username: data.username,
				status: data.status,
				description: data.description,
			});
			await seed.save();
		});

		console.log('success add data!');
	}
};

export { dbSeeder };
