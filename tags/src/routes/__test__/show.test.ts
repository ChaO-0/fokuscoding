import request from 'supertest';
import { app } from '../../app';

it('returns the tag if the user is signed in', async () => {
	const { body: tag } = await request(app)
		.post('/api/tags')
		.set('Cookie', global.signin('pram', true))
		.send({
			name: 'javascript',
			description: 'ini tag javascript',
		})
		.expect(201);

	await request(app)
		.put(`/api/tags/${tag.id}`)
		.set('Cookie', global.signin('yudi', true))
		.send()
		.expect(204);

	const { body: fetchedTag } = await request(app)
		.get(`/api/tags/${tag.name}`)
		.set('Cookie', global.signin('yudi', true))
		.send()
		.expect(200);

	expect(fetchedTag.status).not.toEqual({});
});

it('returns 401 if the user is not signed in', async () => {
	await request(app).get(`/api/tags/javascript`).send().expect(401);
});
