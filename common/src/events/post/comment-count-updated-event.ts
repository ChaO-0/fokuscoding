import { Subjects } from '../subjects';

export interface CommentCountUpdatedEvent {
	subject: Subjects.CommentUpdated;
	data: {
		postId: string;
		commentCount: number;
		version: number;
		updatedAt: Date;
	};
}
