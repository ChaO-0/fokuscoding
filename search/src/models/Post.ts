import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface PostAttrs {
	id: string;
	title: string;
	voteCount: number;
	commentCount: number;
	username: string;
	createdAt: Date;
	updatedAt: Date;
	tags: string[];
}

interface PostDoc extends mongoose.Document {
	title: string;
	voteCount: number;
	commentCount: number;
	username: string;
	tags: string[];
	has_solution: boolean;
	createdAt: Date;
	updatedAt: Date;
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
		voteCount: {
			type: Number,
			required: true,
		},
		commentCount: {
			type: Number,
			required: true,
		},
		createdAt: {
			type: Date,
			required: true,
		},
		updatedAt: {
			type: Date,
			required: true,
		},
		hasSolution: {
			type: Boolean,
			default: false,
		},
		username: {
			type: String,
			required: true,
		},
		tags: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Tag',
			},
		],
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
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
		voteCount: attrs.voteCount,
		commentCount: attrs.commentCount,
		username: attrs.username,
		tags: attrs.tags,
		createdAt: attrs.createdAt,
		updatedAt: attrs.updatedAt,
	});
};

const Post = mongoose.model<PostDoc, PostModel>('Post', postSchema);

export { Post };
