import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { Comment } from '../../../models/Comment';

it('creates a comment if the input is valid', async () => {
	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title: 'nggk bisa',
			body: 'basa enggrees',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/${post.id}`)
		.set('Cookie', global.signin('bukanpram'))
		.send({
			text: 'nggak bisa basa tailan',
		})
		.expect(201);

	const comments = await Comment.find();

	expect(comments.length).toEqual(1);
});

it('it returns 400 if the input is invalid', async () => {
	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title: 'nggk bisa',
			body: 'basa enggrees',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/${post.id}`)
		.set('Cookie', global.signin('bukanpram'))
		.send({
			text: '',
		})
		.expect(400);
});

it('returns 401 if the user is not signed in', async () => {
	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title: 'nggk bisa',
			body: 'basa enggrees',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/${post.id}`)
		.send({
			text: 'dasdas',
		})
		.expect(401);
});

it('returns 404 if the post does not exist', async () => {
	const id = mongoose.Schema.Types.ObjectId;

	await request(app)
		.post(`/api/posts/${id}`)
		.set('Cookie', global.signin('bukanpram'))
		.send({
			text: '',
		})
		.expect(404);
});
