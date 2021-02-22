import { getService } from '@nti/web-client';

import SearchablePagedStore from '../users/SearchablePagedStore';
import UsersStore, { DEFAULT_SIZE } from '../users/Store';

const INITIAL_LOAD_CACHE = Symbol('Initial Load Cache');

async function convertBatch(batch) {
	const items = await Promise.all(
		batch.Items.map(async item => {
			try {
				const course = await item.fetchLinkParsed('CourseInstance');
				return course;
			} catch (e) {
				return item;
			}
		})
	);

	const nextLink = batch.getLink('batch-next');
	const loadNext =
		!nextLink || batch.Items.length < DEFAULT_SIZE
			? null
			: async () => {
					const service = await getService();
					const nextBatch = await service.getBatch(nextLink);

					return UsersStore.convertBatch(nextBatch);
			  };

	return {
		items,
		loadNext,
		total: batch.Total,
	};
}

export default class CoursesStore extends SearchablePagedStore {
	constructor() {
		super();

		this.set('items', []);
		this.set('loading', false);
	}

	async loadSearchTerm(term) {
		this.set('loading', true);
		this.emitChange('loading', 'course');

		const service = await getService();
		const collection = service.getCollection(
			'AdministeredCourses',
			'Courses'
		);
		const batch = await service.getBatch(collection.href, {
			batchSize: DEFAULT_SIZE,
			batchStart: 0,
			filter: term,
		});

		return convertBatch(batch);
	}

	async loadInitial() {
		if (this[INITIAL_LOAD_CACHE]) {
			return this[INITIAL_LOAD_CACHE];
		}

		this.set('loading', true);
		this.emitChange('loading', 'course');

		const service = await getService();
		const collection = service.getCollection(
			'AdministeredCourses',
			'Courses'
		);
		const batch = await service.getBatch(collection.href, {
			batchSize: DEFAULT_SIZE,
			batchStart: 0,
		});

		const result = convertBatch(batch);

		this[INITIAL_LOAD_CACHE] = result;

		return result;
	}
}
