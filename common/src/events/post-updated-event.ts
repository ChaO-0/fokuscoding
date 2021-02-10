import { Subjects } from './subjects';

export interface PostUpdatedEvent {
	subject: Subjects.PostUpdated;
	data: {
		id: string;
		title: string;
		votes: number;
		username: string;
		tags: string[];
		version: number;
	};
}
