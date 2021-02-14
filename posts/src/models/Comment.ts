import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';
import { VoteDoc } from './Vote';

// An interface that describes the properties that are required to create a new Comment
interface CommentAttrs {
	text: string;
	username: string;
}

// An interface that describe the properties that a Comment Model has
interface CommentModel extends mongoose.Model<CommentDoc> {
	build(attrs: CommentAttrs): CommentDoc;
}

// An interface that describe the properties that a Comment Document has
export interface CommentDoc extends mongoose.Document {
	text: string;
	username: string;
	votes: VoteDoc[] | VoteDoc;
}

const commentSchema = new mongoose.Schema(
	{
		text: {
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
				autopopulate: true,
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
		timestamps: true,
	}
);

commentSchema.plugin(autopopulate);

// .statics is used to make a custom built in function
commentSchema.statics.build = (attrs: CommentAttrs) => {
	return new Comment(attrs);
};

const Comment = mongoose.model<CommentDoc, CommentModel>(
	'Comment',
	commentSchema
);

export { Comment };
