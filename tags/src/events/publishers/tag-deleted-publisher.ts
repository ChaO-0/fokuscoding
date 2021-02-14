import { Publisher, TagDeletedEvent, Subjects } from '@heapoverflow/common';

export class TagDeletedPublisher extends Publisher<TagDeletedEvent> {
	readonly subject = Subjects.TagDeleted;
}
