import {Stores} from '@nti/lib-store';

export default class CourseAssignmentStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.set('items', []);
		this.set('loading', false);
	}

	async load (course) {
		if (course === this.get('course')) { return; }

		this.set('course', course);
		this.set('loading', true);
		this.emitChange('loading', 'course');

		try {
			const assignmentCollection = await course.getAssignments();
			const sortedItems = [...(assignmentCollection.getAssignments()) || []].sort((a, b)=>{
				const lowerA = a.title.toLowerCase();
				const lowerB = b.title.toLowerCase();

				if(lowerA < lowerB) {
					return -1;
				}
				else if(lowerA > lowerB) {
					return 1;
				}

				return 0;
			});

			this.set('items', sortedItems);
			this.set('loading', false);
			this.emitChange('items', 'loading');
		} catch (e) {
			this.set('error', true);
			this.set('loading', true);
			this.emitChange('error', 'loading');
		}
	}
}
