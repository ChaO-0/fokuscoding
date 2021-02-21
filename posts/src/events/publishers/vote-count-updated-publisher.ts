import {
	Publisher,
	VoteUpdatedCountEvent,
	Subjects,
} from '@heapoverflow/common';

export class VoteUpdatedPublisher extends Publisher<VoteUpdatedCountEvent> {
	readonly subject = Subjects.VoteUpdated;
}
