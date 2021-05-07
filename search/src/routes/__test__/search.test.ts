import request from 'supertest';
import { app } from '../../app';
import { Post } from '../../models/Post';
import mongoose from 'mongoose';

it('returns 200 if search query is valid', async () => {
	const id = mongoose.Types.ObjectId().toHexString();
	const post = Post.build({
		id,
		title: 'ngetes ajah',
		voteCount: 0,
		commentCount: 0,
		username: 'pram',
		tags: [],
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	await post.save();

	const { body: search } = await request(app)
		.post('/api/search')
		.send({
			query: 'ngetes',
		})
		.expect(200);
	expect(search.length).toBeGreaterThan(0);
});
