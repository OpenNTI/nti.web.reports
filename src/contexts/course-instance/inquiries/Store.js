import { Stores } from '@nti/lib-store';

export default class CourseInquiryStore extends Stores.SimpleStore {
	constructor() {
		super();

		this.set('items', []);
		this.set('loading', false);
		this.set('error', false);
	}

	async load(course) {
		if (course === this.get('course')) {
			return;
		}

		this.set('course', course);
		this.set('loading', true);
		this.set('error', false);
		this.emitChange('loading', 'course', 'error');

		try {
			const inquiries = await course.fetchLink('Inquiries');

			this.set(
				'items',
				inquiries.filter(
					item =>
						item.MimeType === 'application/vnd.nextthought.napoll'
				)
			);
			this.set('loading', false);
			this.emitChange('items', 'loading');
		} catch (e) {
			this.set('error', true);
			this.set('loading', false);
			this.emitChange('error', 'loading');
		}
	}
}
