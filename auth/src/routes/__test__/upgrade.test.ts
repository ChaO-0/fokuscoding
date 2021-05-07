import request from 'supertest';
import { app } from '../../app';

it('upgrades the user to admin if the user is an admin', async () => {
	const { body: user } = await request(app)
		.post('/api/users/signup')
		.send({
			username: 'prama',
			password: 'prama',
			email: 'prama@prama.com',
		})
		.expect(201);

	await request(app)
		.post(`/api/users/${user.id}/upgrade`)
		.set('Cookie', global.signin('yudi', true))
		.send()
		.expect(204);
});

it('returns 401 if the user is not an admin', async () => {
	const { body: user } = await request(app)
		.post('/api/users/signup')
		.send({
			username: 'prama',
			password: 'prama',
			email: 'prama@prama.com',
		})
		.expect(201);

	await request(app)
		.post(`/api/users/${user.id}/upgrade`)
		.set('Cookie', global.signin('yudi'))
		.send()
		.expect(401);
});
