import request from 'supertest';
import { app } from '../../app';

it('updates the password if the user is valid', async () => {
	const { body: user } = await request(app)
		.post('/api/users/signup')
		.send({
			username: 'prama',
			password: 'prama',
			email: 'prama@prama.com',
		})
		.expect(201);

	await request(app)
		.put(`/api/users/${user.username}`)
		.set('Cookie', global.signin('prama'))
		.send({
			oldpass: 'prama',
			newpass: 'pramsworld',
		})
		.expect(204);
});

it('returns 401 if the user is not valid', async () => {
	const { body: user } = await request(app)
		.post('/api/users/signup')
		.send({
			username: 'prama',
			password: 'prama',
			email: 'prama@prama.com',
		})
		.expect(201);

	await request(app)
		.put(`/api/users/${user.username}`)
		.set('Cookie', global.signin('yudi'))
		.send({
			oldpass: 'prama',
			newpass: 'pramsworld',
		})
		.expect(401);
});
