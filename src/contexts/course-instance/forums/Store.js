import {Stores} from '@nti/lib-store';

export default class CourseForumsStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.set('discussions', null);
		this.set('loading', false);
		this.set('error', false);
	}

	async load (course) {
		if (course === this.get('course')) { return; }

		this.set('loading', true);
		this.set('error', false);
		this.set('discussions', null);
		this.set('course', course);
		this.emitChange('loading', 'error', 'discussions', 'course');

		try {
			const discussions = await course.getDiscussions();

			this.set('discussions', discussions);
			this.set('loading', false);
			this.emitChange('loading', 'discussions');
		} catch (e) {
			this.set('loading', false);
			this.set('error', true);
			this.emitChange('loading', 'error');
		}
	}
}
