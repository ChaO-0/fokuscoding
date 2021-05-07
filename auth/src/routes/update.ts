import {
	BadRequestError,
	NotAuthorizedError,
	NotFoundError,
	requireAuth,
	validateRequest,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { compare } from 'bcrypt';
import { body } from 'express-validator';
import { User } from '../models/User';

const router = express.Router();

router.put(
	'/api/users/:username',
	requireAuth,
	[
		body('oldpass').trim().notEmpty(),
		body('newpass')
			.notEmpty()
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must be 4 or 20 characters'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const user = await User.findOne({ username: req.params.username });
		const { oldpass, newpass } = req.body;

		if (!user) {
			throw new NotFoundError();
		}

		if (req.currentUser!.username !== user.username) {
			throw new NotAuthorizedError();
		}

		const passwordsMatch = await compare(oldpass, user.password);

		if (!passwordsMatch) {
			throw new BadRequestError('Wrong old password');
		}

		user.set({
			password: newpass,
		});

		await user.save();

		res.status(204).send(user);
	}
);

export { router as updateUserRouter };
