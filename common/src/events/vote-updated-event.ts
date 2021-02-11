import { Subjects } from './subjects';

export interface VoteUpdatedEvent {
	subject: Subjects.VoteUpdated;
	data: {
		id: string;
		vote: number;
		version: number;
	};
}
