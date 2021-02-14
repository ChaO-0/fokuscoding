import { NotFoundError, validateRequest } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/User';

const router = express.Router();

router.put(
	'/api/users/:username',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.optional()
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be 4 or 20 characters'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const user = await User.findOne({ username: req.params.username });
		const { email, password } = req.body;

		if (!user) {
			throw new NotFoundError();
		}

		if (password) {
			user.set({
				email,
				password,
			});
		} else {
			user.set({
				email,
			});
		}

		await user.save();

		res.send(user);
	}
);

export { router as updateUserRouter };
