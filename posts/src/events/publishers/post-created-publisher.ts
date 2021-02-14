import { Publisher, PostCreatedEvent, Subjects } from '@heapoverflow/common';

export class PostCreatedPublisher extends Publisher<PostCreatedEvent> {
	readonly subject = Subjects.PostCreated;
}
