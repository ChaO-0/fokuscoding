import {
	Publisher,
	Subjects,
	CommentCountUpdatedEvent,
} from '@heapoverflow/common';

export class CommentCountUpdatedPublisher extends Publisher<CommentCountUpdatedEvent> {
	readonly subject = Subjects.CommentUpdated;
}
