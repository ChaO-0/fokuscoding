import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { Comment } from '../../../models/Comment';

it('returns 404 if the comment does not exist', async () => {
	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title: 'badah',
			body: 'prama',
		})
		.expect(201);

	const { body: comment } = await request(app)
		.post(`/api/posts/${post.id}`)
		.set('Cookie', global.signin('bukanpram'))
		.send({
			text: 'nggak bisa basa tailan',
		})
		.expect(201);

	const fakeId = mongoose.Schema.Types.ObjectId;

	await request(app)
		.put(`/api/posts/comment/${fakeId}`)
		.set('Cookie', global.signin('bukanpram'))
		.send({
			text: 'dsasda',
		})
		.expect(404);

	expect(comment.text).toEqual('nggak bisa basa tailan');
});

it('returns 401 if the user is not signed in', async () => {
	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title: 'badah',
			body: 'prama',
		})
		.expect(201);

	const { body: comment } = await request(app)
		.post(`/api/posts/${post.id}`)
		.set('Cookie', global.signin('bukanpram'))
		.send({
			text: 'nggak bisa basa tailan',
		})
		.expect(201);

	await request(app)
		.put(`/api/posts/comment/${comment.id}`)
		.send({
			text: 'dsasda',
		})
		.expect(401);

	expect(comment.text).toEqual('nggak bisa basa tailan');
});

it('returns 401 if the user does not own the comment', async () => {
	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title: 'badah',
			body: 'prama',
		})
		.expect(201);

	const { body: comment } = await request(app)
		.post(`/api/posts/${post.id}`)
		.set('Cookie', global.signin('bukanpram'))
		.send({
			text: 'nggak bisa basa tailan',
		})
		.expect(201);

	await request(app)
		.put(`/api/posts/comment/${comment.id}`)
		.set('Cookie', global.signin('pramayasa'))
		.send({
			text: 'dsasda',
		})
		.expect(401);

	expect(comment.text).toEqual('nggak bisa basa tailan');
});

it('returns 400 if the input is invalid', async () => {
	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title: 'badah',
			body: 'prama',
		})
		.expect(201);

	const { body: comment } = await request(app)
		.post(`/api/posts/${post.id}`)
		.set('Cookie', global.signin('bukanpram'))
		.send({
			text: 'nggak bisa basa tailan',
		})
		.expect(201);

	await request(app)
		.put(`/api/posts/comment/${comment.id}`)
		.set('Cookie', global.signin('bukanpram'))
		.send({
			text: '',
		})
		.expect(400);
});

it('updates the comment if the input is valid', async () => {
	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title: 'badah',
			body: 'prama',
		})
		.expect(201);

	const { body: comment } = await request(app)
		.post(`/api/posts/${post.id}`)
		.set('Cookie', global.signin('bukanpram'))
		.send({
			text: 'nggak bisa basa tailan',
		})
		.expect(201);

	await request(app)
		.put(`/api/posts/comment/${comment.id}`)
		.set('Cookie', global.signin('bukanpram'))
		.send({
			text: 'pramah',
		})
		.expect(200);

	const updatedComment = await Comment.findById(comment.id);
	expect(updatedComment.text).toEqual('pramah');
});
