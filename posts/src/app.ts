import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { currentUser, NotFoundError } from '@heapoverflow/common';
import { errorHandler } from '@heapoverflow/common';

import { indexPostRouter } from './routes/post/index';
import { newPostRouter } from './routes/post/new';
import { deletePostRouter } from './routes/post/delete';
import { showPostRouter } from './routes/post/show';
import { updatePostRouter } from './routes/post/update';
import { newCommentRouter } from './routes/comment/new';
import { updateCommentRouter } from './routes/comment/update';
import { deleteCommentRouter } from './routes/comment/delete';
import { upvotePostRouter } from './routes/post/vote/up';
import { downvotePostRouter } from './routes/post/vote/down';
import { upvoteCommentRouter } from './routes/comment/up';
import { downvoteCommentRouter } from './routes/comment/down';

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test',
	})
);

app.use(currentUser);
app.use(indexPostRouter);
app.use(newPostRouter);
app.use(deletePostRouter);
app.use(showPostRouter);
app.use(updatePostRouter);
app.use(newCommentRouter);
app.use(updateCommentRouter);
app.use(deleteCommentRouter);
app.use(upvotePostRouter);
app.use(downvotePostRouter);
app.use(upvoteCommentRouter);
app.use(downvoteCommentRouter);

app.all('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
