import mongoose from 'mongoose';
import { hash } from 'bcrypt';

// An interface that describes the properties that are required to create a new user
interface UserAttrs {
	email: string;
	password: string;
	username: string;
}

// An interface that describe the properties that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

// An interface that describe the properties that a User Document has
export interface UserDoc extends mongoose.Document {
	email: string;
	password: string;
	username: string;
	is_admin: boolean;
	banned: boolean;
}

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		is_admin: {
			type: Boolean,
			default: false,
		},
		banned: {
			type: Boolean,
			default: false,
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.password;
				delete ret.__v;
			},
		},
	}
);

userSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hashed = await hash(this.get('password'), 12);
		this.set('password', hashed);
	}
	done();
});

// .statics is used to make a custom built in function
userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
