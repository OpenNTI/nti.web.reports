import {Stores} from '@nti/lib-store';

const PAGE_SIZE = 10;

export default class CourseTopicListStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.params = {
			batchSize: 20
		};

		this.set('loading', true);
		this.set('error', false);
		this.set('items', []);
		this.set('hasMore', false);
	}

	async load (forum) {
		const dataSource = forum.getContentsDataSource();

		this.set('forum', forum);
		this.set('dataSource', dataSource);
		this.set('loading', true);
		this.set('error', false);
		this.emitChange('loading', 'error', 'forum', 'dataSource');

		try {
			const page = await dataSource.loadPage(0, this.params);

			this.set('loading', false);
			this.set('lastPage', 0);
			this.set('items', page.Items);
			this.set('hasMore', page.Items.length >= PAGE_SIZE);
			this.emitChange('loading', 'items', 'hasMore');
		} catch (e) {
			this.set('loading', false);
			this.set('error', true);
			this.set('hasMore', false);
			this.emitChange('loading', 'error', 'hasMore');
		}
	}


	async loadNextPage () {
		const lastPage = this.get('lastPage');
		const dataSource = this.get('dataSource');
		const items = this.get('items');

		this.set('loading', true);
		this.set('error', false);
		this.emitChange('loading', 'error');

		try {
			const page = await dataSource.loadPage(lastPage + 1, this.params);

			this.set('loading', false);
			this.set('lastPage', lastPage + 1);
			this.set('items', [...items, ...page.Items]);
			this.set('hasMore', page.Items.length >= PAGE_SIZE);
			this.emitChange('loading', 'items', 'hasMore');
		} catch (e) {
			this.set('loading', false);
			this.set('error', true);
			this.set('hasMore', false);
			this.emitChange('loading', 'error', 'hasMore');
		}
	}
}
