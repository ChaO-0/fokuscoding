import { User } from '../models/User';

const dbSeeder = async () => {
	const data = await User.find().exec();
	if (data.length === 0) {
		const seed = User.build({
			email: 'admin@admin.com',
			password: 'admin',
			username: 'admin',
		});
		seed.set({
			is_admin: true,
		});
		await seed.save();

		console.log('success add data!');
	}
};

export { dbSeeder };
