import request from 'supertest';
import { app } from '../../../app';
import { Post } from '../../../models/Post';

it('creates a post if input is valid', async () => {
	const cookie = await global.signin('prama');

	await request(app)
		.post('/api/posts')
		.set('Cookie', cookie)
		.send({
			body: 'pram',
			title: 'pram',
		})
		.expect(201);

	const post = await Post.find({});
	expect(post.length).toEqual(1);
});

it('returns 400 if title is not valid', async () => {
	const cookie = await global.signin('prama');

	await request(app)
		.post('/api/posts')
		.set('Cookie', cookie)
		.send({
			body: 'prama',
			title: '',
		})
		.expect(400);
});

it('returns 400 if body is not valid', async () => {
	const cookie = await global.signin('prama');

	await request(app)
		.post('/api/posts')
		.set('Cookie', cookie)
		.send({
			title: 'prama',
			body: '',
		})
		.expect(400);
});

it('returns 401 if user is not signed in', async () => {
	await request(app)
		.post('/api/posts')
		.send({
			title: 'pram',
			body: 'pram',
		})
		.expect(401);
});

it('does not returns 401 if user is signed in', async () => {
	const cookie = await global.signin('prama');

	const response = await request(app)
		.post('/api/posts')
		.set('Cookie', cookie)
		.send({});

	expect(response.status).not.toEqual(401);
});

// TODO: Create a new test for checking tags
