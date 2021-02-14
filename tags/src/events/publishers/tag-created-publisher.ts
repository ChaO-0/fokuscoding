import { Publisher, TagCreatedEvent, Subjects } from '@heapoverflow/common';

export class TagCreatedPublisher extends Publisher<TagCreatedEvent> {
	readonly subject = Subjects.TagCreated;
}
