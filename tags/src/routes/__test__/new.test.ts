import request from 'supertest';
import { app } from '../../app';
import { Tag } from '../../models/Tag';
import { natsWrapper } from '../../nats-wrapper';
import { TagStatus } from '../../types/tag-status';

it('has accepted status if the user is an admin', async () => {
	const { body: tag } = await request(app)
		.post('/api/tags')
		.set('Cookie', global.signin('pram', true))
		.send({
			name: 'php',
		})
		.expect(201);

	const createdTag = await Tag.findById(tag.id);
	expect(createdTag.status).toEqual(TagStatus.Accepted);
});

it('has awaiting status if the user is not an admin', async () => {
	const { body: tag } = await request(app)
		.post('/api/tags')
		.set('Cookie', global.signin('pram'))
		.send({
			name: 'php',
		})
		.expect(201);

	const createdTag = await Tag.findById(tag.id);
	expect(createdTag.status).toEqual(TagStatus.Awaiting);
});

it('returns 401 if the user is not signed in', async () => {
	await request(app)
		.post('/api/tags')
		.send({
			name: 'php',
		})
		.expect(401);
});

it('emits an tag created event if tag status is accepted', async () => {
	const { body: tag } = await request(app)
		.post('/api/tags')
		.set('Cookie', global.signin('pram', true))
		.send({
			name: 'php',
		})
		.expect(201);

	const createdTag = await Tag.findById(tag.id);
	expect(createdTag.status).toEqual(TagStatus.Accepted);
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('does not emits an tag created event if tag status is awaiting', async () => {
	const { body: tag } = await request(app)
		.post('/api/tags')
		.set('Cookie', global.signin('pram'))
		.send({
			name: 'php',
		})
		.expect(201);

	const createdTag = await Tag.findById(tag.id);
	expect(createdTag.status).toEqual(TagStatus.Awaiting);
	expect(natsWrapper.client.publish).not.toHaveBeenCalled();
});
