import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';
import { NotFoundError, errorHandler, currentUser } from '@heapoverflow/common';

import { indexTagRouter } from './routes/index';
import { newTagRouter } from './routes/new';
import { deleteTagRouter } from './routes/delete';
import { acceptTagRouter } from './routes/accept';
import { reviewTagRouter } from './routes/review';
import { userTagRouter } from './routes/user-tag';
import { showTagRouter } from './routes/show';
import { toggleActiveRouter } from './routes/toggle';

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
app.use(indexTagRouter);
app.use(newTagRouter);
app.use(deleteTagRouter);
app.use(acceptTagRouter);
app.use(toggleActiveRouter);
app.use(reviewTagRouter);
app.use(userTagRouter);
app.use(showTagRouter);

app.all('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
