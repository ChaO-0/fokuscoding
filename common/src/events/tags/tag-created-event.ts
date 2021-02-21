import { Subjects } from '../subjects';

export interface TagCreatedEvent {
	subject: Subjects.TagCreated;
	data: {
		id: string;
		name: string;
		version?: number;
	};
}
