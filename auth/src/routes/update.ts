import express from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.put('/api/users/:user_id', async (req, res) => {
	const user = await User.findById(req.params.user_id);
	const { email, password } = req.body;

	user.set({
		email,
		password,
	});

	await user.save();

	res.send(user);
});

export { router as signoutRouter };
