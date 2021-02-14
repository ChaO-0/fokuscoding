import { Publisher, Subjects, PostUpdatedEvent } from '@heapoverflow/common';

export class PostUpdatedPublisher extends Publisher<PostUpdatedEvent> {
	readonly subject = Subjects.PostUpdated;
}
