import { Publisher, Subjects, PostDeletedEvent } from '@heapoverflow/common';

export class PostDeletedPublisher extends Publisher<PostDeletedEvent> {
	readonly subject = Subjects.PostDeleted;
}
