import request from 'supertest';
import { app } from '../../app';
import { Tag } from '../../models/Tag';

it('deletes the tag if the user is an admin', async () => {
	const { body: tag } = await request(app)
		.post('/api/tags')
		.set('Cookie', global.signin('pram', true))
		.send({
			name: 'javascript',
		})
		.expect(201);

	await request(app)
		.delete(`/api/tags/${tag.id}`)
		.set('Cookie', global.signin('yudi', true))
		.send({
			name: 'javascript',
		})
		.expect(204);

	const deletedTag = await Tag.findById(tag.id);
	expect(deletedTag).toEqual(null);
});
