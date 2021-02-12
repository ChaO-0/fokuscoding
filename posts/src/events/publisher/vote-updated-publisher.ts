import { Publisher, VoteUpdatedEvent, Subjects } from '@heapoverflow/common';

export class VoteUpdatedPublisher extends Publisher<VoteUpdatedEvent> {
	readonly subject = Subjects.VoteUpdated;
}
