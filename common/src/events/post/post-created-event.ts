import { Subjects } from '../subjects';

export interface PostCreatedEvent {
	subject: Subjects.PostCreated;
	data: {
		id: string;
		title: string;
		voteCount: number;
		commentCount: number;
		username: string;
		tags: string[];
		createdAt: Date;
		updatedAt: Date;
	};
}
