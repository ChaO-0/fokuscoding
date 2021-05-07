import request from 'supertest';
import { app } from '../../app';

it('returns all user if the user is admin', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			username: 'prama',
			password: 'prama',
			email: 'prama@prama.com',
		})
		.expect(201);

	await request(app)
		.get(`/api/users`)
		.set('Cookie', global.signin('yudi', true))
		.send()
		.expect(200);
});

it('returns 401 if the user is not an admin', async () => {
	await request(app)
		.get('/api/users')
		.set('Cookie', global.signin('yudi'))
		.send()
		.expect(401);
});
