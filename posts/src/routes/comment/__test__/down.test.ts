import request from 'supertest';
import { app } from '../../../app';
import { Comment } from '../../../models/Comment';
import mongoose from 'mongoose';

it('creates downvote if the user has not voted the comment', async () => {
	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title: 'prr',
			body: 'aam',
		});
	expect(201);

	const { body: comment } = await request(app)
		.post(`/api/posts/${post.id}`)
		.set('Cookie', global.signin('tester'))
		.send({
			text: 'asdasd',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/comment/${comment.id}/down`)
		.set('Cookie', global.signin('duar'))
		.send()
		.expect(201);

	const upvotedComment = await Comment.findById(comment.id);
	expect(upvotedComment.votes.length).toEqual(1);
});

it('deletes the downvote if the user voted down second time', async () => {
	const username = 'prama';
	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin(username))
		.send({
			title: 'nggak bisa',
			body: 'basa enggrees',
		})
		.expect(201);

	const { body: comment } = await request(app)
		.post(`/api/posts/${post.id}`)
		.set('Cookie', global.signin('tester'))
		.send({
			text: 'asdasd',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/comment/${comment.id}/down`)
		.set('Cookie', global.signin(username))
		.send()
		.expect(201);

	await request(app)
		.post(`/api/posts/comment/${comment.id}/down`)
		.set('Cookie', global.signin(username))
		.send()
		.expect(204);

	const savedComment = await Comment.findById(comment.id);

	expect(savedComment.votes.length).toEqual(0);
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

	const { body: comment } = await request(app)
		.post(`/api/posts/${post.id}`)
		.set('Cookie', global.signin('tester'))
		.send({
			text: 'asdasd',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/comment/${comment.id}/down`)
		.send()
		.expect(401);
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

	const { body: comment } = await request(app)
		.post(`/api/posts/${post.id}`)
		.set('Cookie', global.signin('tester'))
		.send({
			text: 'asdasd',
		})
		.expect(201);

	await request(app)
		.post(`/api/posts/comment/${comment.id}/up`)
		.set('Cookie', global.signin(username))
		.send()
		.expect(201);

	await request(app)
		.post(`/api/posts/comment/${comment.id}/down`)
		.set('Cookie', global.signin(username))
		.send()
		.expect(204);

	const savedComment = await Comment.findById(comment.id).populate('votes');

	expect(savedComment.votes[0].type).toEqual('down');
});

it('returns 404 if the comment does not exist', async () => {
	const id = mongoose.Schema.Types.ObjectId;

	await request(app).post(`/api/posts/comment/${id}/down`).expect(404);
});
