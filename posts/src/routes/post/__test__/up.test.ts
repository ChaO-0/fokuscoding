import request from 'supertest';
import { app } from '../../../app';
import { Post } from '../../../models/Post';
import mongoose from 'mongoose';
import { natsWrapper } from '../../../nats-wrapper';

it('creates upvote if the user has not voted the post', async () => {
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
		.post(`/api/posts/${post1.id}/vote`)
		.set('Cookie', global.signin(user2))
		.send({
			voteType: 'up',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/${post1.id}/vote`)
		.set('Cookie', global.signin(user1))
		.send({
			voteType: 'up',
		})
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
		.post(`/api/posts/${post2.id}/vote`)
		.set('Cookie', global.signin(user1))
		.send({
			voteType: 'up',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/${post2.id}/vote`)
		.set('Cookie', global.signin(user2))
		.send({
			voteType: 'up',
		})
		.expect(201);

	const firstPost = await Post.findById(post1.id);
	const secondPost = await Post.findById(post2.id);

	expect(firstPost.votes.length).toEqual(2);
	expect(secondPost.votes.length).toEqual(2);
});

it('deletes the upvote if the user voted up second time', async () => {
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
		.post(`/api/posts/${post.id}/vote`)
		.set('Cookie', global.signin(username))
		.send({
			voteType: 'up',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/${post.id}/vote`)
		.set('Cookie', global.signin(username))
		.send({
			voteType: 'up',
		})
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

	await request(app)
		.post(`/api/posts/${post.id}/vote`)
		.send({ voteType: 'up' })
		.expect(401);
});

it('updates the vote to up if the user has voted down', async () => {
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
		.post(`/api/posts/${post.id}/vote`)
		.set('Cookie', global.signin(username))
		.send({
			voteType: 'down',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/${post.id}/vote`)
		.set('Cookie', global.signin(username))
		.send({
			voteType: 'up',
		})
		.expect(204);

	const savedPost = await Post.findById(post.id).populate('votes');

	expect(savedPost.votes[0].type).toEqual('up');
});

it('returns 404 if the post does not exist', async () => {
	const id = mongoose.Schema.Types.ObjectId;

	await request(app)
		.post(`/api/posts/${id}/vote`)
		.send({ voteType: 'up' })
		.expect(404);
});

it('emits a vote updated event if the user voted', async () => {
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
		.post(`/api/posts/${post1.id}/vote`)
		.set('Cookie', global.signin(user2))
		.send({
			voteType: 'up',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/${post1.id}/vote`)
		.set('Cookie', global.signin(user1))
		.send({
			voteType: 'up',
		})
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
		.post(`/api/posts/${post2.id}/vote`)
		.set('Cookie', global.signin(user1))
		.send({
			voteType: 'up',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/${post2.id}/vote`)
		.set('Cookie', global.signin(user2))
		.send({
			voteType: 'up',
		})
		.expect(201);

	const firstPost = await Post.findById(post1.id);
	const secondPost = await Post.findById(post2.id);

	expect(firstPost.votes.length).toEqual(2);
	expect(secondPost.votes.length).toEqual(2);
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
