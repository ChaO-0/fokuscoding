import request from 'supertest';
import { app } from '../../../app';
import { Post } from '../../../models/Post';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';

it('deletes the post if the user owns it', async () => {
	const username = 'pram';

	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin(username))
		.send({
			title: 'horas',
			body: 'prama',
		})
		.expect(201);

	await request(app)
		.delete(`/api/posts/${post.id}`)
		.set('Cookie', global.signin(username))
		.send()
		.expect(204);

	const posts = await Post.find();

	expect(posts.length).toEqual(0);
});

it('deletes the post if the user is an admin', async () => {
	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title: 'horas',
			body: 'prama',
		})
		.expect(201);

	await request(app)
		.delete(`/api/posts/${post.id}`)
		.set('Cookie', global.signin('yudi', true))
		.send()
		.expect(204);

	const posts = await Post.find();

	expect(posts.length).toEqual(0);
});

it('returns 401 if the user does not own the post', async () => {
	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title: 'horas',
			body: 'prama',
		})
		.expect(201);

	await request(app)
		.delete(`/api/posts/${post.id}`)
		.set('Cookie', global.signin('bukanpram'))
		.send()
		.expect(401);

	const posts = await Post.find();

	expect(posts.length).toEqual(1);
});

it('returns 404 if the post does not exist', async () => {
	const username = 'pram';
	const id = mongoose.Schema.Types.ObjectId;

	await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin(username))
		.send({
			title: 'horas',
			body: 'prama',
		})
		.expect(201);

	await request(app)
		.delete(`/api/posts/${id}`)
		.set('Cookie', global.signin(username))
		.send()
		.expect(404);

	const posts = await Post.find();

	expect(posts.length).toEqual(1);
});

it('emits a post deleted event if the post is deleted', async () => {
	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title: 'horas',
			body: 'prama',
		})
		.expect(201);

	await request(app)
		.delete(`/api/posts/${post.id}`)
		.set('Cookie', global.signin('yudi', true))
		.send()
		.expect(204);

	const posts = await Post.find();

	expect(posts.length).toEqual(0);
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
