import { Publisher, TagUpdatedEvent, Subjects } from '@heapoverflow/common';

export class TagUpdatedPublisher extends Publisher<TagUpdatedEvent> {
	readonly subject = Subjects.TagUpdated;
}
