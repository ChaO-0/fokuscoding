import express from 'express';
import 'express-async-errors';
import cookieSession from 'cookie-session';

import { currentUser, NotFoundError, errorHandler } from '@heapoverflow/common';

import { SearchRouter } from './routes/search';

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
app.use(SearchRouter);

app.all('*', async (req, res) => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
