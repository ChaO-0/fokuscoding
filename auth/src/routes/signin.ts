import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { compare } from 'bcrypt';
import { User } from '../models/User';
import { validateRequest } from '@heapoverflow/common';
import { BadRequestError } from '@heapoverflow/common';

const router = express.Router();

router.post(
	'/api/users/signin',
	[
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.trim()
			.notEmpty()
			.withMessage('You must supply a password'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			throw new BadRequestError('Invalid Credentials');
		}

		if (existingUser.banned) {
			throw new BadRequestError('Banned');
		}

		const passwordsMatch = await compare(password, existingUser.password);

		if (!passwordsMatch) {
			throw new BadRequestError('Invalid Credentials');
		}

		// Generate JWT
		const userJwt = jwt.sign(
			{
				username: existingUser.username,
				admin: existingUser.is_admin,
				email: existingUser.email,
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

		res.status(200).send(existingUser);
	}
);

export { router as signinRouter };
