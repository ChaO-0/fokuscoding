import mongoose from 'mongoose';
import { TagStatus } from '../types/tag-status';

// An interface that describes the properties that are required to create a new Tag
interface TagAttrs {
	id: string;
	name: string;
}

// An interface that describe the properties that a Tag Model has
interface TagModel extends mongoose.Model<TagDoc> {
	build(attrs: TagAttrs): TagDoc;
}

// An interface that describe the properties that a Tag Document has
export interface TagDoc extends mongoose.Document {
	name: string;
}

const tagSchema = new mongoose.Schema(
	{
		name: {
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

// .statics is used to make a custom built in function
tagSchema.statics.build = (attrs: TagAttrs) => {
	return new Tag({
		_id: attrs.id,
		name: attrs.name,
	});
};

const Tag = mongoose.model<TagDoc, TagModel>('Tag', tagSchema);

export { Tag };