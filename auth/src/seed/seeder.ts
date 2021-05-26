import { User } from '../models/User';

const dbSeeder = async () => {
	const data = await User.find().exec();
	if (data.length === 0) {
		const seed = User.build({
			email: 'admin@fokuscoding.dev',
			password: 'admin',
			username: 'admin',
		});
		seed.set({
			is_admin: true,
		});
		await seed.save();
		const seed2 = User.build({
			email: 'fajaralnito@gmail.com',
			password: 'fajar',
			username: 'fajar',
		});
		await seed2.save();
		console.log('success add data!');
	}
};

export { dbSeeder };
