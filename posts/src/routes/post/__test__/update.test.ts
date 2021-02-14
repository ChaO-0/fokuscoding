import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../../app';
import { natsWrapper } from '../../../nats-wrapper';

it('returns 404 if post id does not exist', async () => {
	const id = mongoose.Schema.Types.ObjectId;
	await request(app)
		.put(`/api/posts/${id}`)
		.set('Cookie', global.signin('prama'))
		.send({
			title: 'pram',
			body: 'pram',
		})
		.expect(404);
});

it('returns 401 if the user is not authenticated', async () => {
	const response = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('prama'))
		.send({ title: 'pram', body: 'hiks' })
		.expect(201);

	await request(app)
		.put(`/api/posts/${response.body.id}`)
		.send({
			title: 'pram',
			body: 'pram',
		})
		.expect(401);
});

it('returns 401 if the user does not own the post', async () => {
	const response = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('prama'))
		.send({ title: 'pram', body: 'hiks' })
		.expect(201);

	await request(app)
		.put(`/api/posts/${response.body.id}`)
		.set('Cookie', global.signin('bukanprama'))
		.send({ title: 'pram', body: 'hiks' })
		.expect(401);
});

it('returns 400 if the input is invalid', async () => {
	const username = 'prama';

	const response = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('prama'))
		.send({ title: 'pram', body: 'hiks' })
		.expect(201);

	await request(app)
		.put(`/api/posts/${response.body.id}`)
		.set('Cookie', global.signin(username))
		.send({ title: '', body: 'pram' })
		.expect(400);

	await request(app)
		.put(`/api/posts/${response.body.id}`)
		.set('Cookie', global.signin(username))
		.send({ title: 'pram', body: '' })
		.expect(400);
});

it('updates the post if the input is valid', async () => {
	const username = 'prama';

	const response = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('prama'))
		.send({ title: 'pram', body: 'hiks' })
		.expect(201);

	await request(app)
		.put(`/api/posts/${response.body.id}`)
		.set('Cookie', global.signin(username))
		.send({ title: 'nggak bisa', body: 'basa enggres TT' })
		.expect(200);
});

it('emits a post updated event if the post is updated', async () => {
	const username = 'prama';

	const response = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('prama'))
		.send({ title: 'pram', body: 'hiks' })
		.expect(201);

	await request(app)
		.put(`/api/posts/${response.body.id}`)
		.set('Cookie', global.signin(username))
		.send({ title: 'nggak bisa', body: 'basa enggres TT' })
		.expect(200);

	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
