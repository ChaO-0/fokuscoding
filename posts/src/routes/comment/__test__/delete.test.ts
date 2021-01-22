import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { Comment } from '../../../models/Comment';

it('deletes the comment if the user owns it', async () => {
	const username = 'yudi';

	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title: 'nggk bsa basa enggres',
			body: 'mabar',
		})
		.expect(201);

	const { body: comment } = await request(app)
		.post(`/api/posts/${post.id}`)
		.set('Cookie', global.signin(username))
		.send({
			text: 'nggk bisa basa tailan',
		})
		.expect(201);

	const comments = await Comment.find();
	expect(comments.length).toEqual(1);

	await request(app)
		.delete(`/api/posts/${post.id}/comment/${comment.id}`)
		.set('Cookie', global.signin(username))
		.send()
		.expect(204);

	const deletedComment = await Comment.findById(comment.id);
	expect(deletedComment).toEqual(null);
});

it('returns 404 if the comment does not exist', async () => {
	const username = 'yudi';

	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title: 'nggk bsa basa enggres',
			body: 'mabar',
		})
		.expect(201);

	const { body: comment } = await request(app)
		.post(`/api/posts/${post.id}`)
		.set('Cookie', global.signin(username))
		.send({
			text: 'nggk bisa basa tailan',
		})
		.expect(201);

	const comments = await Comment.find();
	expect(comments.length).toEqual(1);

	const fakeId = mongoose.Schema.Types.ObjectId;

	await request(app)
		.delete(`/api/posts/${post.id}/comment/${fakeId}`)
		.set('Cookie', global.signin(username))
		.send()
		.expect(404);

	const deletedComment = await Comment.findById(comment.id);
	expect(deletedComment).toBeDefined();
});

it('returns 404 if the post does not exist', async () => {
	const username = 'yudi';

	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title: 'nggk bsa basa enggres',
			body: 'mabar',
		})
		.expect(201);

	const { body: comment } = await request(app)
		.post(`/api/posts/${post.id}`)
		.set('Cookie', global.signin(username))
		.send({
			text: 'nggk bisa basa tailan',
		})
		.expect(201);

	const comments = await Comment.find();
	expect(comments.length).toEqual(1);

	const fakeId = mongoose.Schema.Types.ObjectId;

	await request(app)
		.delete(`/api/posts/${fakeId}/comment/${comment.id}`)
		.set('Cookie', global.signin(username))
		.send()
		.expect(404);

	const deletedComment = await Comment.findById(comment.id);
	expect(deletedComment).toBeDefined();
});

it('returns 401 if the user does not own it', async () => {
	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title: 'nggk bsa basa enggres',
			body: 'mabar',
		})
		.expect(201);

	const { body: comment } = await request(app)
		.post(`/api/posts/${post.id}`)
		.set('Cookie', global.signin('yudi'))
		.send({
			text: 'nggk bisa basa tailan',
		})
		.expect(201);

	const comments = await Comment.find();
	expect(comments.length).toEqual(1);

	await request(app)
		.delete(`/api/posts/${post.id}/comment/${comment.id}`)
		.set('Cookie', global.signin('pram'))
		.send()
		.expect(401);

	const deletedComment = await Comment.findById(comment.id);
	expect(deletedComment).toBeDefined();
});

it('returns 401 if the user does not signed in', async () => {
	const username = 'yudi';

	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title: 'nggk bsa basa enggres',
			body: 'mabar',
		})
		.expect(201);

	const { body: comment } = await request(app)
		.post(`/api/posts/${post.id}`)
		.set('Cookie', global.signin(username))
		.send({
			text: 'nggk bisa basa tailan',
		})
		.expect(201);

	await request(app)
		.delete(`/api/posts/${post.id}/comment/${comment.id}`)
		.send()
		.expect(401);

	const deletedComment = await Comment.findById(comment.id);
	expect(deletedComment).toBeDefined();
});
