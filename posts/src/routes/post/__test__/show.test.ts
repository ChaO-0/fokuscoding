import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../../app';

it('fetches the post if the post exists', async () => {
	const title = 'nggak bisa',
		body = 'basa enggres';

	const { body: post } = await request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('pram'))
		.send({
			title,
			body,
		})
		.expect(201);

	const { body: fetchedPost } = await request(app)
		.get(`/api/posts/${post.id}`)
		.send()
		.expect(200);

	expect(fetchedPost.title).toEqual(title);
	expect(fetchedPost.body).toEqual(body);
});

it('returns 404 if the post does not exist', async () => {
	const id = mongoose.Schema.Types.ObjectId;

	await request(app).get(`/api/posts/${id}`).send().expect(404);
});
