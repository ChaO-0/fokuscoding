import { NotAuthorizedError, requireAuth } from '@heapoverflow/common';
import express from 'express';
import { User, UserDoc } from '../models/User';

const router = express.Router();

router.post('/api/users/:user_id/ban', requireAuth, async (req, res) => {
	const user: UserDoc = await User.findById(req.params.user_id);

	if (!req.currentUser!.admin) {
		throw new NotAuthorizedError();
	}

	if (user.banned || user.username === 'admin') {
		user.set({
			banned: false,
		});
		await user.save();
	} else {
		user.set({
			banned: true,
		});

		await user.save();
	}

	res.send(user);
});

export { router as banRouter };
