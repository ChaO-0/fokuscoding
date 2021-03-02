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
import { votePostRouter } from './routes/post/vote';
import { voteCommentRouter } from './routes/comment/vote';
import { solutionRouter } from './routes/post/solution';

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
app.use(votePostRouter);
app.use(voteCommentRouter);

app.use(solutionRouter);

app.all('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
