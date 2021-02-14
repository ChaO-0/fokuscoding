import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Tag } from '../../models/Tag';
import { natsWrapper } from '../../nats-wrapper';

it('deletes the tag if the user is an admin', async () => {
	const { body: tag } = await request(app)
		.post('/api/tags')
		.set('Cookie', global.signin('pram', true))
		.send({
			name: 'javascript',
		})
		.expect(201);

	await request(app)
		.delete(`/api/tags/${tag.id}`)
		.set('Cookie', global.signin('yudi', true))
		.send()
		.expect(204);

	const deletedTag = await Tag.findById(tag.id);
	expect(deletedTag).toEqual(null);
});

it('returns 401 if the user is an not admin', async () => {
	const { body: tag } = await request(app)
		.post('/api/tags')
		.set('Cookie', global.signin('pram', true))
		.send({
			name: 'javascript',
		})
		.expect(201);

	await request(app)
		.delete(`/api/tags/${tag.id}`)
		.set('Cookie', global.signin('yudi'))
		.send()
		.expect(401);
});

it('returns 404 if the tag is an not found', async () => {
	const id = mongoose.Schema.Types.ObjectId;

	await request(app)
		.post('/api/tags')
		.set('Cookie', global.signin('pram', true))
		.send({
			name: 'javascript',
		})
		.expect(201);

	await request(app)
		.delete(`/api/tags/${id}`)
		.set('Cookie', global.signin('yudi', true))
		.send()
		.expect(404);
});

it('emits tag deleted event if the tag status is accepted', async () => {
	const { body: tag } = await request(app)
		.post('/api/tags')
		.set('Cookie', global.signin('pram', true))
		.send({
			name: 'javascript',
		})
		.expect(201);

	await request(app)
		.delete(`/api/tags/${tag.id}`)
		.set('Cookie', global.signin('yudi', true))
		.send()
		.expect(204);

	const deletedTag = await Tag.findById(tag.id);
	expect(deletedTag).toEqual(null);
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('does not emits tag deleted event if the tag status is awaiting', async () => {
	const { body: tag } = await request(app)
		.post('/api/tags')
		.set('Cookie', global.signin('pram'))
		.send({
			name: 'javascript',
		})
		.expect(201);

	await request(app)
		.delete(`/api/tags/${tag.id}`)
		.set('Cookie', global.signin('yudi', true))
		.send()
		.expect(204);

	const deletedTag = await Tag.findById(tag.id);
	expect(deletedTag).toEqual(null);
	expect(natsWrapper.client.publish).not.toHaveBeenCalled();
});
