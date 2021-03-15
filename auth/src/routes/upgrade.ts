import { NotAuthorizedError, requireAuth } from '@heapoverflow/common';
import express from 'express';
import { User } from '../models/User';

const router = express.Router();

router.post('/api/users/:user_id/upgrade', requireAuth, async (req, res) => {
	const user = await User.findById(req.params.user_id);

	if (!req.currentUser!.admin) {
		throw new NotAuthorizedError();
	}

	user.set({
		is_admin: true,
	});

	await user.save();

	res.send(user);
});

export { router as upgradeRouter };
