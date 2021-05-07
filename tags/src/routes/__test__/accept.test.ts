import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Tag } from '../../models/Tag';
import { TagStatus } from '../../types/tag-status';

it('updates the tag status to accepted if the user is an admin', async () => {
	const { body: tag } = await request(app)
		.post('/api/tags')
		.set('Cookie', global.signin('pram'))
		.send({
			name: 'php',
			description: 'ini tag php',
		})
		.expect(201);

	const createdTag = await Tag.findById(tag.id);
	expect(createdTag.status).toEqual(TagStatus.Awaiting);

	await request(app)
		.post(`/api/tags/${tag.id}/accept`)
		.set('Cookie', global.signin('yudi', true))
		.send()
		.expect(200);

	const acceptedTag = await Tag.findById(tag.id);
	expect(acceptedTag.status).toEqual(TagStatus.Accepted);
});

it('returns 404 if the tag is not found', async () => {
	const id = mongoose.Schema.Types.ObjectId;

	await request(app)
		.post(`/api/tags/${id}/accept`)
		.set('Cookie', global.signin('yudi', true))
		.send()
		.expect(404);
});

it('returns 401 if the user is not an admin', async () => {
	const { body: tag } = await request(app)
		.post('/api/tags')
		.set('Cookie', global.signin('pram'))
		.send({
			name: 'php',
			description: 'ini tag php',
		})
		.expect(201);

	const createdTag = await Tag.findById(tag.id);
	expect(createdTag.status).toEqual(TagStatus.Awaiting);

	await request(app)
		.post(`/api/tags/${tag.id}/accept`)
		.set('Cookie', global.signin('yudi'))
		.send()
		.expect(401);

	const acceptedTag = await Tag.findById(tag.id);
	expect(acceptedTag.status).toEqual(TagStatus.Awaiting);
});
