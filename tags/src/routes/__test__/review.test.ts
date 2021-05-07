import request from 'supertest';
import { app } from '../../app';
import { Tag } from '../../models/Tag';
import { TagStatus } from '../../types/tag-status';

it('fetches all the tags based on status query if the user is admin', async () => {
	const tag = Tag.build({
		name: 'test',
		description: 'test',
		status: TagStatus.Accepted,
		username: 'prama',
		posts: [],
	});

	await tag.save();

	const { body: fetchedTag } = await request(app)
		.get('/api/tags/review?status=accepted')
		.set('Cookie', global.signin('pram', true))
		.send()
		.expect(200);

	expect(fetchedTag[0].status).toEqual('accepted');

	const tag1 = Tag.build({
		name: 'test',
		description: 'test',
		status: TagStatus.Awaiting,
		username: 'prama',
		posts: [],
	});

	await tag1.save();

	const { body: fetchedTag1 } = await request(app)
		.get('/api/tags/review?status=awaiting')
		.set('Cookie', global.signin('pram', true))
		.send()
		.expect(200);

	expect(fetchedTag1[0].status).toEqual('awaiting');

	const tag2 = Tag.build({
		name: 'test',
		description: 'test',
		status: TagStatus.Rejected,
		username: 'prama',
		posts: [],
	});

	await tag2.save();

	const { body: fetchedTag2 } = await request(app)
		.get('/api/tags/review?status=rejected')
		.set('Cookie', global.signin('pram', true))
		.send()
		.expect(200);

	expect(fetchedTag2[0].status).toEqual('rejected');
});

it('returns 401 if the user is not an admin', async () => {
	await request(app)
		.get('/api/tags/review?status=accepted')
		.set('Cookie', global.signin('pram'))
		.send()
		.expect(401);

	await request(app)
		.get('/api/tags/review?status=awaiting')
		.set('Cookie', global.signin('pram'))
		.send()
		.expect(401);

	await request(app)
		.get('/api/tags/review?status=rejected')
		.set('Cookie', global.signin('pram'))
		.send()
		.expect(401);
});
