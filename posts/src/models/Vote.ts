import mongoose from 'mongoose';

// An interface that describes the properties that are required to create a new Vote
interface VoteAttrs {
	type: string;
	username: string;
}

// An interface that describe the properties that a Vote Model has
interface VoteModel extends mongoose.Model<VoteDoc> {
	build(attrs: VoteAttrs): VoteDoc;
}

// An interface that describe the properties that a Vote Document has
export interface VoteDoc extends mongoose.Document {
	type: string;
	username: string;
}

const voteSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
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
	}
);

// .statics is used to make a custom built in function
voteSchema.statics.build = (attrs: VoteAttrs) => {
	return new Vote(attrs);
};

const Vote = mongoose.model<VoteDoc, VoteModel>('Vote', voteSchema);

export { Vote };
