import {
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
	validateRequest,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.put(
	'/api/users/:username',
	requireAuth,
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.optional()
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be 4 or 20 characters'),
		body('username')
			.isLength({ min: 4, max: 20 })
			.withMessage('Username must be 4 or 20 characters'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const user = await User.findOne({ username: req.params.username });
		const { email, password, username } = req.body;

		if (!user) {
			throw new NotFoundError();
		}

		if (req.currentUser!.username !== user.username) {
			throw new NotAuthorizedError();
		}

		if (password) {
			user.set({
				email,
				username,
				password,
			});
		} else {
			user.set({
				email,
				username,
			});
		}

		await user.save();

		// Generate JWT
		const userJwt = jwt.sign(
			{
				username: user.username,
				admin: user.is_admin,
				email: user.email,
			},
			process.env.JWT_KEY!,
			{
				expiresIn: '2d',
			}
		);

		req.session = {
			jwt: userJwt,
		};

		res.send(user);
	}
);

export { router as updateUserRouter };
