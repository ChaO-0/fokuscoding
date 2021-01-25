import { Subjects } from './subjects';
import { TagStatus } from '../types/tag-status';

export interface TagCreatedEvent {
	subject: Subjects.TagCreated;
	data: {
		id: string;
		version: number;
		name: string;
		status: TagStatus;
	};
}
