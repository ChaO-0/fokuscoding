import mongoose from 'mongoose';

// An interface that describes the properties that are required to create a new Tag
interface TagAttrs {
	name: string;
}

// An interface that describe the properties that a Tag Model has
interface TagModel extends mongoose.Model<TagDoc> {
	build(attrs: TagAttrs): TagDoc;
}

// An interface that describe the properties that a Tag Document has
interface TagDoc extends mongoose.Document {
	name: string;
}

const tagSchema = new mongoose.Schema(
	{
		tag: {
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
tagSchema.statics.build = (attrs: TagAttrs) => {
	return new Tag(attrs);
};

const Tag = mongoose.model<TagDoc, TagModel>('Tag', tagSchema);

export { Tag };
