import request from 'supertest';
import { app } from '../../app';
import { Tag } from '../../models/Tag';
import { TagStatus } from '../../types/tag-status';

it('returns the tags made by the user', async () => {
	const tag = Tag.build({
		description: 'test',
		name: 'tester',
		status: TagStatus.Accepted,
		username: 'prama',
	});

	await tag.save();

	const tag1 = Tag.build({
		description: 'dsa',
		name: 'asd',
		status: TagStatus.Accepted,
		username: 'pramad',
	});

	await tag1.save();

	await request(app)
		.put(`/api/tags/${tag.id}`)
		.set('Cookie', global.signin('pram', true))
		.send()
		.expect(204);

	await request(app)
		.put(`/api/tags/${tag1.id}`)
		.set('Cookie', global.signin('pram', true))
		.send()
		.expect(204);

	const { body: fetchedTags } = await request(app)
		.get('/api/tags/usertag')
		.set('Cookie', global.signin('prama'))
		.send()
		.expect(200);

	expect(fetchedTags.length).toEqual(1);
});

it('does not returns the tag that does not belong to the user', async () => {
	const tag = Tag.build({
		description: 'test',
		name: 'tester',
		status: TagStatus.Accepted,
		username: 'prama',
	});

	await tag.save();

	await request(app)
		.put(`/api/tags/${tag.id}`)
		.set('Cookie', global.signin('pram', true))
		.send()
		.expect(204);

	const { body: fetchedTags } = await request(app)
		.get('/api/tags/usertag')
		.set('Cookie', global.signin('pram'))
		.send()
		.expect(200);

	expect(fetchedTags.length).toEqual(0);
});

it('returns 401 if the user is not signed in', async () => {
	await request(app).get('/api/tags/usertag').send().expect(401);
});
