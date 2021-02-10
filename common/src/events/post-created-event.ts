import { Subjects } from './subjects';

export interface PostCreatedEvent {
	subject: Subjects.PostCreated;
	data: {
		id: string;
		title: string;
		votes: number;
		username: string;
		tags: string[];
	};
}
