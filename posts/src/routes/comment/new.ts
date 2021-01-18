import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@heapoverflow/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Post } from '../../models/Post';
import { Comment } from '../../models/Comment';

const router = express.Router();

router.post(
  '/api/posts/:post_id',
  requireAuth,
  [body('text').not().isEmpty().withMessage('Text is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const post = await Post.findById(req.params.post_id);

    if (!post) {
      throw new NotFoundError();
    }

    const comment = Comment.build({
      text: req.body.text,
      username: req.currentUser!.username,
    });
    await comment.save();

    post.comments.push(comment.id);
    await post.save();

    res.status(201).send(post);
  }
);

export { router as newCommentRouter };
