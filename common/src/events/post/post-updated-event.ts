import { Subjects } from '../subjects';

export interface PostUpdatedEvent {
	subject: Subjects.PostUpdated;
	data: {
		id: string;
		title: string;
		body: string;
		username: string;
		tags: string[];
		version: number;
		updatedAt: Date;
	};
}
