import { NotAuthorizedError, requireAuth } from '@heapoverflow/common';
import express from 'express';
import { User, UserDoc } from '../models/User';

const router = express.Router();

router.post('/api/users/:user_id/upgrade', requireAuth, async (req, res) => {
	const user: UserDoc = await User.findById(req.params.user_id);

	if (!req.currentUser!.admin) {
		throw new NotAuthorizedError();
	}

	if (
		req.currentUser?.admin &&
		req.currentUser.username === 'admin' &&
		user.is_admin
	) {
		console.log('here admin');

		user.set({
			is_admin: false,
		});
		await user.save();
	} else {
		user.set({
			is_admin: true,
		});

		await user.save();
	}

	res.send(user);
});

export { router as upgradeRouter };
