import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { currentUser, NotFoundError } from '@heapoverflow/common';
import { errorHandler } from '@heapoverflow/common';

import { indexPostRouter } from './routes/index';
import { newPostRouter } from './routes/new';
import { deletePostRouter } from './routes/delete';
import { showPostRouter } from './routes/show';
import { updatePostRouter } from './routes/update';

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

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
