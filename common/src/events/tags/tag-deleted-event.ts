import { Subjects } from '../subjects';

export interface TagDeletedEvent {
	subject: Subjects.TagDeleted;
	data: {
		id: string;
	};
}
