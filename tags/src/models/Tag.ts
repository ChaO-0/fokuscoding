import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { TagStatus } from '../types/tag-status';

// An interface that describes the properties that are required to create a new Tag
interface TagAttrs {
	name: string;
	username: string;
	status: TagStatus;
	description: string;
	posts?: string[];
	is_active?: boolean;
}

// An interface that describe the properties that a Tag Model has
interface TagModel extends mongoose.Model<TagDoc> {
	build(attrs: TagAttrs): TagDoc;
}

// An interface that describe the properties that a Tag Document has
export interface TagDoc extends mongoose.Document {
	name: string;
	username: string;
	status: TagStatus;
	description: string;
	is_active: boolean;
	version: number;
	posts: string[];
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
		description: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		is_active: {
			type: Boolean,
			default: false,
		},
		posts: [
			{
				type: mongoose.Schema.Types.ObjectId,
				default: [],
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

tagSchema.set('versionKey', 'version');
tagSchema.plugin(updateIfCurrentPlugin);

// .statics is used to make a custom built in function
tagSchema.statics.build = (attrs: TagAttrs) => {
	return new Tag(attrs);
};

const Tag = mongoose.model<TagDoc, TagModel>('Tag', tagSchema);

export { Tag };
