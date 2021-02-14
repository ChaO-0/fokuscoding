import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../app';
import { Post } from '../../../models/Post';
import { Tag } from '../../../models/Tag';
import { natsWrapper } from '../../../nats-wrapper';

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

it('have tags if the user add post with tags', async () => {
	const cookie = await global.signin('prama');
	const id1 = mongoose.Types.ObjectId().toHexString();
	const id2 = mongoose.Types.ObjectId().toHexString();
	// console.log(id);

	const tag1 = Tag.build({
		id: id1,
		name: 'javascript',
	});

	await tag1.save();

	const tag2 = Tag.build({
		id: id2,
		name: 'php',
	});

	await tag2.save();

	await request(app)
		.post('/api/posts')
		.set('Cookie', cookie)
		.send({
			body: 'pram',
			title: 'pram',
			tags: [tag1.id, tag2.id],
		})
		.expect(201);

	const post = await Post.find({});
	expect(post.length).toEqual(1);
	expect(post[0].tags.length).toEqual(2);
});

it('emits a post created event if the post is created', async () => {
	const cookie = await global.signin('prama');
	const id1 = mongoose.Types.ObjectId().toHexString();
	const id2 = mongoose.Types.ObjectId().toHexString();
	// console.log(id);

	const tag1 = Tag.build({
		id: id1,
		name: 'javascript',
	});

	await tag1.save();

	const tag2 = Tag.build({
		id: id2,
		name: 'php',
	});

	await tag2.save();

	await request(app)
		.post('/api/posts')
		.set('Cookie', cookie)
		.send({
			body: 'pram',
			title: 'pram',
			tags: [tag1.id, tag2.id],
		})
		.expect(201);

	const post = await Post.find({});
	expect(post.length).toEqual(1);
	expect(post[0].tags.length).toEqual(2);
	expect(natsWrapper.client.publish).toHaveBeenCalled();
});
