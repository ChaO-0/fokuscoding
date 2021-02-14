import request from 'supertest';
import { app } from '../../app';
import { Tag } from '../../models/Tag';

it('fetches all the tags if the user is signed in', async () => {
	await request(app)
		.post('/api/tags')
		.set('Cookie', global.signin('yudi', true))
		.send({
			name: 'golang',
		})
		.expect(201);

	await request(app)
		.post('/api/tags')
		.set('Cookie', global.signin('yudi', true))
		.send({
			name: 'javascript',
		})
		.expect(201);
	const { body: fetchedTag } = await request(app)
		.get('/api/tags')
		.set('Cookie', global.signin('pram'))
		.send()
		.expect(200);

	const tags = await Tag.find();
	expect(fetchedTag[0].name).toEqual(tags[0].name);
	expect(fetchedTag[0].status).toEqual(tags[0].status);
});

it('returns 401 if the user is not signed in', async () => {
	await request(app)
		.post('/api/tags')
		.set('Cookie', global.signin('yudi', true))
		.send({
			name: 'golang',
		})
		.expect(201);

	await request(app).get('/api/tags').send().expect(401);
});
