import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PostAttrs {
	id: string;
	title: string;
	votes: number;
	username: string;
	tags: string[];
}

interface PostDoc extends mongoose.Document {
	title: string;
	votes: number;
	username: string;
	tags: string[];
	version: number;
}

interface PostModel extends mongoose.Model<PostDoc> {
	build(attrs: PostAttrs): PostDoc;
	findByEvent(event: { id: string; version: number }): Promise<PostDoc | null>;
}

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		votes: {
			type: Number,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		tags: {
			type: [],
			required: true,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
		timestamps: true,
	}
);

postSchema.set('versionKey', 'version');
postSchema.plugin(updateIfCurrentPlugin);

postSchema.statics.findByEvent = (event: { id: string; version: number }) => {
	return Post.findOne({
		_id: event.id,
		version: event.version - 1,
	});
};

postSchema.statics.build = (attrs: PostAttrs) => {
	return new Post({
		_id: attrs.id,
		title: attrs.title,
		votes: attrs.votes,
		username: attrs.username,
		tags: attrs.tags,
	});
};

const Post = mongoose.model<PostDoc, PostModel>('Post', postSchema);

export { Post };
