import {Stores} from '@nti/lib-store';

const getLoadId = () => Date.now();

export default class SearchablePagedStore extends Stores.SimpleStore {
	constructor () {
		super();

		this.set('searchTerm', null);

		this.set('items', null);
		this.set('loading', false);
		this.set('error', null);

		this.set('loadingNextPage', false);
		this.set('loadNextPage', null);
	}

	get hasNextPage () {
		return !!this.get('loadNextPage');
	}


	async load () {
		const loadId = this.activeLoad = getLoadId();
		const searchTerm = this.get('searchTerm');

		this.set('loading', true);
		this.emitChange('loading');

		this.set('items', []);
		this.set('loadNextPage', null);

		try {
			const {items, loadNext} = await (searchTerm ? this.loadSearchTerm(searchTerm) : this.loadInitial());

			if (loadId !== this.activeLoad || searchTerm !== this.get('searchTerm')) { return; }

			this.setImmediate({
				items,
				loadNextPage: loadNext,
				loading: false
			});
		} catch (e) {
			this.setImmediate({
				error: e,
				loading: false
			});
			this.set('error', e);
			this.emitChange('error');
		}
	}


	async loadNextPage () {
		const loadId = this.activeLoad = getLoadId();

		const loadNextPage = this.get('loadNextPage');

		if (!loadNextPage) { return; }

		this.set('loadingNextPage', true);
		this.set('loadNextPage', null);
		this.emitChange('loadingNextPage', 'hasNextPage');

		try {
			const {items, loadNext} = await loadNextPage();

			if (loadId !== this.activeLoad) { return; }

			//append the items to the current set
			this.set('items', [...this.get('items'), ...items]);
			this.set('loadNextPage', loadNext);
			this.emitChange('items', 'hasNextPage');
		} catch (e) {
			this.set('error', e);
			this.emitChange('error');
		} finally {
			this.set('loadingNextPage', false);
			this.emitChange('loadingNextPage');
		}
	}


	updateSearchTerm (term) {
		this.set('loading', true);
		this.set('searchTerm', term);
		this.emitChange('loading', 'searchTerm');

		delete this.activeLoad;
		clearTimeout(this.doSearchTimeout);

		if (!term) {
			this.load();
		} else {
			this.doSearchTimeout = setTimeout(() => {
				this.load();
			}, 300);
		}
	}

	/**
   * Return the items and loadNext function for a given search term
   * @override
   * @param  {string} term term to search on
   * @returns {Object}      with the items and loadNext function if there is a next page
   */
	loadSearchTerm (term) {}

	/**
   * Return the items and loadNext function for a given search term
   * @override
   * @returns {Object}      with the items and loadNext function if there is a next page
   */
	loadInitial () {}
}
