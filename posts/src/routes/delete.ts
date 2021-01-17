import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Post } from '../models/Post';

const router = express.Router();

router.delete(
  '/api/posts/:post_id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { post_id } = req.params;
    const post = await Post.findById(post_id);

    if (!post) {
      throw new NotFoundError();
    }

    if (req.currentUser!.username !== post.username) {
      throw new NotAuthorizedError();
    }

    await Post.deleteOne({ _id: post_id });

    res.status(204);
  }
);

export { router as deletePostRouter };
