import mongoose from 'mongoose';

// An interface that describes the properties that are required to create a new Comment
interface CommentAttrs {
  text: string;
  username: string;
}

// An interface that describe the properties that a Comment Model has
interface CommentModel extends mongoose.Model<CommentDoc> {
  build(attrs: CommentAttrs): CommentDoc;
}

// An interface that describe the properties that a Post Document has
export interface CommentDoc extends mongoose.Document {
  text: string;
  username: string;
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
commentSchema.statics.build = (attrs: CommentAttrs) => {
  return new Comment(attrs);
};

const Comment = mongoose.model<CommentDoc, CommentModel>(
  'Comment',
  commentSchema
);

export { Comment };
