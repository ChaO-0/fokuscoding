import mongoose from 'mongoose';
import { CommentDoc } from './Comment';
import { VoteDoc } from './Vote';
import { TagDoc } from './Tag';

// An interface that describes the properties that are required to create a new Post
interface PostAttrs {
	title: string;
	body: string;
	username: string;
	tags?: string[];
}

// An interface that describe the properties that a Post Model has
interface PostModel extends mongoose.Model<PostDoc> {
	build(attrs: PostAttrs): PostDoc;
}

// An interface that describe the properties that a Post Document has
interface PostDoc extends mongoose.Document {
	title: string;
	body: string;
	username: string;
	comments?: CommentDoc;
	votes?: VoteDoc;
	tags?: TagDoc;
}

const PostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		body: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		votes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Vote',
			},
		],
		comments: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment',
			},
		],
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
				delete ret.__v;
			},
		},
	}
);

// .statics is used to make a custom built in function
PostSchema.statics.build = (attrs: PostAttrs) => {
	return new Post(attrs);
};

const Post = mongoose.model<PostDoc, PostModel>('Post', PostSchema);

export { Post };
