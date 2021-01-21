import request from 'supertest';
import { app } from '../../../app';

const createPost = () =>
	request(app)
		.post('/api/posts')
		.set('Cookie', global.signin('prama'))
		.send({ title: 'pram', body: 'prama' });

it('can fetch a list of posts', async () => {
	await createPost();
	await createPost();
	await createPost();

	const response = await request(app).get('/api/posts').send().expect(200);

	expect(response.body.length).toEqual(3);
});
