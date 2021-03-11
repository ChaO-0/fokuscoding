import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { validateRequest } from '@heapoverflow/common';
import { User } from '../models/User';
import { BadRequestError } from '@heapoverflow/common';

const router = express.Router();

router.post(
	'/api/users/signup',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('username')
			.isLength({ min: 4, max: 20 })
			.withMessage('Username must be 4 or 20 characters'),
		body('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be 4 or 20 characters'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password, username } = req.body;

		const existingEmail = await User.findOne({ email });
		const existingUsername = await User.findOne({ username });

		if (existingEmail) {
			throw new BadRequestError('Email in use');
		}

		if (existingUsername) {
			throw new BadRequestError('Username in use');
		}

		const user = User.build({ email, password, username });
		await user.save();

		// Generate JWT
		const userJwt = jwt.sign(
			{
				username: user.username,
				admin: user.is_admin,
			},
			process.env.JWT_KEY!,
			{
				expiresIn: '2d',
			}
		);

		// Store it on session object
		req.session = {
			jwt: userJwt,
		};

		res.status(201).send(user);
	}
);

export { router as signupRouter };
