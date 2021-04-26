import mongoose, { PaginateModel } from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import mongoosePaginate from 'mongoose-paginate-v2';
import { CommentDoc } from './Comment';
import { VoteDoc } from './Vote';
import { TagDoc } from './Tag';

// An interface that describes the properties that are required to create a new Post
interface PostAttrs {
	title: string;
	body: string;
	username: string;
	tags?: TagDoc[];
}

// An interface that describe the properties that a Post Model has
interface PostModel<T extends mongoose.Document> extends PaginateModel<T> {
	build(attrs: PostAttrs): PostDoc;
}

// An interface that describe the properties that a Post Document has
export interface PostDoc extends mongoose.Document {
	title: string;
	body: string;
	username: string;
	comments: CommentDoc[];
	votes: VoteDoc[] | VoteDoc;
	tags?: TagDoc[];
	solution: CommentDoc;
	has_solution: boolean;
	createdAt: Date;
	updatedAt: Date;
	version: number;
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
				default: [],
			},
		],
		solution: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment',
			default: null,
		},
		has_solution: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.__v;
			},
		},
		timestamps: true,
	}
);

PostSchema.set('versionKey', 'version');
PostSchema.plugin(mongoosePaginate);
PostSchema.plugin(updateIfCurrentPlugin);

// .statics is used to make a custom built in function
PostSchema.statics.build = (attrs: PostAttrs) => {
	return new Post(attrs);
};

const Post: PostModel<PostDoc> = mongoose.model<PostDoc, PostModel<PostDoc>>(
	'Post',
	PostSchema
) as PostModel<PostDoc>;

export { Post };
