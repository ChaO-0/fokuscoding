import request from 'supertest';
import { app } from '../../app';
import { Tag } from '../../models/Tag';
import { TagStatus } from '../../types/tag-status';

it('sets is_active to true if it false', async () => {
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

	const activatedTag = await Tag.findById(tag.id);

	expect(activatedTag.is_active).toEqual(true);
});

it('sets is_active to false if it true', async () => {
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

	const activatedTag = await Tag.findById(tag.id);

	expect(activatedTag.is_active).toEqual(true);

	await request(app)
		.put(`/api/tags/${tag.id}`)
		.set('Cookie', global.signin('pram', true))
		.send()
		.expect(204);

	const deactivatedTag = await Tag.findById(tag.id);
	expect(deactivatedTag.is_active).toEqual(false);
});

it('returns 401 if the user is not an admin', async () => {
	const tag = Tag.build({
		description: 'test',
		name: 'tester',
		status: TagStatus.Accepted,
		username: 'prama',
	});

	await tag.save();
	await request(app)
		.put(`/api/tags/${tag.id}`)
		.set('Cookie', global.signin('pram'))
		.send()
		.expect(401);
});
