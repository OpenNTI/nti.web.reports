import {Stores} from 'nti-lib-store';
import {getService} from 'nti-web-client';

import UsersStore from '../users/Store';

const DEFAULT_SIZE = 20;

export default class CoursesStore extends Stores.SearchablePagedStore {
	constructor () {
		super();

		this.set('items', []);
		this.set('loading', false);
	}

	async loadSearchTerm (term) {
		this.set('loading', true);
		this.emitChange('loading', 'course');

		const service = await getService();
		const collection = service.getCollection('AdministeredCourses', 'Courses');
		const batch = await service.getBatch(collection.href, {batchSize: DEFAULT_SIZE, batchStart: 0, filter: term});

		return UsersStore.convertBatch(batch);
	}

	async loadInitial () {
		this.set('loading', true);
		this.emitChange('loading', 'course');

		const service = await getService();
		const collection = service.getCollection('AdministeredCourses', 'Courses');
		const batch = await service.getBatch(collection.href, {batchSize: DEFAULT_SIZE, batchStart: 0});

		return UsersStore.convertBatch(batch);
	}
}
