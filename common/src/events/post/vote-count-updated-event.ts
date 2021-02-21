import { Subjects } from '../subjects';

export interface VoteUpdatedCountEvent {
	subject: Subjects.VoteUpdated;
	data: {
		postId: string;
		voteCount: number;
		updatedAt: Date;
		version: number;
	};
}
