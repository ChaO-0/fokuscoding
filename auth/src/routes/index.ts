import { NotAuthorizedError, requireAuth } from '@heapoverflow/common';
import express from 'express';
import { User } from '../models/User';

const router = express.Router();

router.get('/api/users', requireAuth, async (req, res) => {
	const user = await User.find({ username: { $not: { $eq: 'admin' } } });

	if (!req.currentUser!.admin) {
		throw new NotAuthorizedError();
	}

	res.send(user);
});

export { router as indexRouter };
