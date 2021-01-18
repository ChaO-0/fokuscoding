import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Post } from '../../models/Post';

const router = express.Router();

router.put(
  '/api/posts/:post_id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('body').not().isEmpty().withMessage('Body is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      throw new NotFoundError();
    }

    if (req.currentUser!.username !== post.username) {
      throw new NotAuthorizedError();
    }

    post.set({
      title: req.body.title,
      body: req.body.body,
    });

    await post.save();

    res.send(post);
  }
);

export { router as updatePostRouter };
