import {
	Publisher,
	SolutionUpdatedEvent,
	Subjects,
} from '@heapoverflow/common';

export class SolutionUpdatedPublisher extends Publisher<SolutionUpdatedEvent> {
	readonly subject = Subjects.SolutionUpdated;
}
