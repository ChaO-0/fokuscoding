import { requireAuth, validateRequest } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Post } from '../models/Post';

const router = express.Router();

router.post(
  '/api/posts',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is Required'),
    body('body').not().isEmpty().withMessage('Body is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, body } = req.body;
    const username = req.currentUser!.username;

    const post = Post.build({ title, body, username });
    await post.save();

    res.status(201).send(post);
  }
);

export { router as newPostRouter };
