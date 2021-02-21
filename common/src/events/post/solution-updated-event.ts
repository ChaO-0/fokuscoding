import { Subjects } from '../subjects';

export interface SolutionUpdatedEvent {
	subject: Subjects.SolutionUpdated;
	data: {
		postId: string;
		hasSolution: boolean;
		updatedAt: Date;
		version: number;
	};
}
