import request from 'supertest';
import { app } from '../../../app';
import { Post } from '../../../models/Post';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';

it('creates downvote if the user has not voted the post', async () => {
	const user1 = 'pram';
	const user2 = 'bukanpram';

	const { body: post1 } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin(user1))
		.send({
			title: 'nggak bisa',
			body: 'basa enggrees',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/${post1.id}/down`)
		.set('Cookie', global.signin(user2))
		.send()
		.expect(201);

	await request(app)
		.post(`/api/posts/${post1.id}/down`)
		.set('Cookie', global.signin(user1))
		.send()
		.expect(201);

	const { body: post2 } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin(user2))
		.send({
			title: 'nggak bisa',
			body: 'basa enggrees',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/${post2.id}/down`)
		.set('Cookie', global.signin(user1))
		.send()
		.expect(201);

	await request(app)
		.post(`/api/posts/${post2.id}/down`)
		.set('Cookie', global.signin(user2))
		.send()
		.expect(201);

	const firstPost = await Post.findById(post1.id);
	const secondPost = await Post.findById(post2.id);

	expect(firstPost.votes.length).toEqual(2);
	expect(secondPost.votes.length).toEqual(2);
});

it('deletes the downvote if the user voted up second time', async () => {
	const username = 'prama';
	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin(username))
		.send({
			title: 'nggak bisa',
			body: 'basa enggrees',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/${post.id}/down`)
		.set('Cookie', global.signin(username))
		.send()
		.expect(201);

	await request(app)
		.post(`/api/posts/${post.id}/down`)
		.set('Cookie', global.signin(username))
		.send()
		.expect(204);

	const savedPost = await Post.findById(post.id);

	expect(savedPost.votes.length).toEqual(0);
});

it('returns 401 if the user is not signed in', async () => {
	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title: 'nggak bisa',
			body: 'basa enggrees',
		})
		.expect(201);

	await request(app).post(`/api/posts/${post.id}/down`).send().expect(401);
});

it('updates the vote to down if the user has voted up', async () => {
	const username = 'prama';

	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin(username))
		.send({
			title: 'nggak bisa',
			body: 'basa enggrees',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/${post.id}/up`)
		.set('Cookie', global.signin(username))
		.send()
		.expect(201);

	await request(app)
		.post(`/api/posts/${post.id}/down`)
		.set('Cookie', global.signin(username))
		.send()
		.expect(204);

	const savedPost = await Post.findById(post.id).populate('votes');

	expect(savedPost.votes[0].type).toEqual('down');
});

it('returns 404 if the post does not exist', async () => {
	const id = mongoose.Schema.Types.ObjectId;

	await request(app).post(`/api/posts/${id}/down`).expect(404);
});

it('emits post updated event if the user voted the post', async () => {
	const user1 = 'pram';
	const user2 = 'bukanpram';

	const { body: post1 } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin(user1))
		.send({
			title: 'nggak bisa',
			body: 'basa enggrees',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/${post1.id}/down`)
		.set('Cookie', global.signin(user2))
		.send()
		.expect(201);

	await request(app)
		.post(`/api/posts/${post1.id}/down`)
		.set('Cookie', global.signin(user1))
		.send()
		.expect(201);

	const { body: post2 } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin(user2))
		.send({
			title: 'nggak bisa',
			body: 'basa enggrees',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/${post2.id}/down`)
		.set('Cookie', global.signin(user1))
		.send()
		.expect(201);

	await request(app)
		.post(`/api/posts/${post2.id}/down`)
		.set('Cookie', global.signin(user2))
		.send()
		.expect(201);

	const firstPost = await Post.findById(post1.id);
	const secondPost = await Post.findById(post2.id);

	expect(firstPost.votes.length).toEqual(2);
	expect(secondPost.votes.length).toEqual(2);
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
