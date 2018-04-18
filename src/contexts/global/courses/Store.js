import {Stores} from '@nti/lib-store';
import {getService} from '@nti/web-client';

import UsersStore, {DEFAULT_SIZE} from '../users/Store';

const INITIAL_LOAD_CACHE = Symbol('Initial Load Cache');

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
		if (this[INITIAL_LOAD_CACHE]) {
			return this[INITIAL_LOAD_CACHE];
		}

		this.set('loading', true);
		this.emitChange('loading', 'course');

		const service = await getService();
		const collection = service.getCollection('AdministeredCourses', 'Courses');
		const batch = await service.getBatch(collection.href, {batchSize: DEFAULT_SIZE, batchStart: 0});

		const result = UsersStore.convertBatch(batch);

		this[INITIAL_LOAD_CACHE] = result;

		return result;
	}
}
