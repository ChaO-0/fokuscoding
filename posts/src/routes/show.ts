import { NotFoundError } from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { Post } from '../models/Post';

const router = express.Router();

router.get('/api/posts/:post_id', async (req: Request, res: Response) => {
  const post = await Post.findById(req.params.post_id);

  if (!post) {
    throw new NotFoundError();
  }

  res.send(post);
});

export { router as showPostRouter };
