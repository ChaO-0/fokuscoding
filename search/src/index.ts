import mongoose from 'mongoose';
import { app } from './app';
import { PostCreatedListener } from './events/listener/post-created-listener';
import { PostDeletedListener } from './events/listener/post-deleted-listener';
import { PostUpdatedListener } from './events/listener/post-updated-listener';
import { VoteUpdatedListener } from './events/listener/vote-updated-listener';
import { TagCreatedListener } from './events/listener/tag-created-listener';
import { TagDeletedListener } from './events/listener/tag-deleted-listener';
import { TagUpdatedListener } from './events/listener/tag-updated-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY must be defined');
	}

	if (!process.env.MONGO_URI) {
		throw new Error('MONGO_URI must be defined');
	}

	if (!process.env.NATS_CLIENT_ID) {
		throw new Error('NATS_CLIENT_ID must be defined');
	}

	if (!process.env.NATS_URL) {
		throw new Error('NATS_URL must be defined');
	}

	if (!process.env.NATS_CLUSTER_ID) {
		throw new Error('NATS_CLUSTER_ID must be defined');
	}

	try {
		await natsWrapper.connect(
			process.env.NATS_CLUSTER_ID,
			process.env.NATS_CLIENT_ID,
			process.env.NATS_URL
		);

		natsWrapper.client.on('close', () => {
			console.log('NATS connection closed!');
			process.exit();
		});

		process.on('SIGINT', () => natsWrapper.client.close());
		process.on('SIGTERM', () => natsWrapper.client.close());

		new PostCreatedListener(natsWrapper.client).listen();
		new PostUpdatedListener(natsWrapper.client).listen();
		new PostDeletedListener(natsWrapper.client).listen();
		new VoteUpdatedListener(natsWrapper.client).listen();
		new TagCreatedListener(natsWrapper.client).listen();
		new TagUpdatedListener(natsWrapper.client).listen();
		new TagDeletedListener(natsWrapper.client).listen();

		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log('Connected to MongoDb');
	} catch (err) {
		console.error(err);
	}

	app.listen(3000, () => {
		console.log('Listening on port 3000!!!!');
	});
};

start();
