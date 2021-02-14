import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { TagStatus } from '../types/tag-status';

// An interface that describes the properties that are required to create a new Tag
interface TagAttrs {
	name: string;
	status: TagStatus;
	desc: string;
}

// An interface that describe the properties that a Tag Model has
interface TagModel extends mongoose.Model<TagDoc> {
	build(attrs: TagAttrs): TagDoc;
}

// An interface that describe the properties that a Tag Document has
interface TagDoc extends mongoose.Document {
	name: string;
	status: TagStatus;
	version: number;
	desc: string;
}

const tagSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: Object.values(TagStatus),
		},
		desc: {
			type: String,
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
	}
);

tagSchema.set('versionKey', 'version');
tagSchema.plugin(updateIfCurrentPlugin);

// .statics is used to make a custom built in function
tagSchema.statics.build = (attrs: TagAttrs) => {
	return new Tag(attrs);
};

const Tag = mongoose.model<TagDoc, TagModel>('Tag', tagSchema);

export { Tag };
