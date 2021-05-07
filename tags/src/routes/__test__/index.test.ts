import request from 'supertest';
import { app } from '../../app';
import { Tag } from '../../models/Tag';
import { TagStatus } from '../../types/tag-status';

it('fetches all the tags if the user is signed in and tags is active', async () => {
	const tag = Tag.build({
		name: 'test',
		description: 'test',
		status: TagStatus.Accepted,
		username: 'prama',
		posts: [],
	});

	await tag.save();

	tag.set({
		is_active: true,
	});

	await tag.save();
	const tags = await Tag.find();

	const { body: fetchedTag } = await request(app)
		.get('/api/tags')
		.set('Cookie', global.signin('pram'))
		.send()
		.expect(200);

	expect(fetchedTag[0].name).toEqual(tags[0].name);
	expect(fetchedTag[0].status).toEqual(tags[0].status);
});

it('returns 401 if the user is not signed in', async () => {
	const { body: tag } = await request(app)
		.post('/api/tags')
		.set('Cookie', global.signin('yudi', true))
		.send({
			name: 'golang',
			description: 'ini description golang',
		})
		.expect(201);

	await request(app)
		.put(`/api/tags/${tag.id}`)
		.set('Cookie', global.signin('pram', true))
		.send()
		.expect(204);

	await request(app).get('/api/tags').send().expect(401);
});
