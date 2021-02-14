import request from 'supertest';
import { app } from '../../app';
import { User } from '../../models/User';

it('bans a user if the user is an admin', async () => {
	const { body: user } = await request(app)
		.post('/api/users/signup')
		.send({
			username: 'prama',
			password: 'prama',
			email: 'prama@prama.com',
		})
		.expect(201);

	await request(app)
		.post(`/api/users/${user.id}/ban`)
		.set('Cookie', global.signin('yudi', true))
		.send()
		.expect(200);

	const bannedUser = await User.findById(user.id);
	expect(bannedUser.banned).toEqual(true);
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
		.post(`/api/users/${user.id}/ban`)
		.set('Cookie', global.signin('yudi'))
		.send()
		.expect(401);

	const bannedUser = await User.findById(user.id);
	expect(bannedUser.banned).toEqual(false);
});
