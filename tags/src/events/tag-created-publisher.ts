import { Publisher } from './base-publisher';
import { Subjects } from './subjects';
import { TagCreatedEvent } from './tag-created-event';

export class TagCreatedPublisher extends Publisher<TagCreatedEvent> {
	readonly subject = Subjects.TagCreated;
}
