import {Stores} from 'nti-lib-store';
import {User, getService} from 'nti-web-client';

export const DEFAULT_SIZE = 20;
const INITIAL_LOAD_CACHE = Symbol('Initial Load Cache');

export default class UsersStore extends Stores.SearchablePagedStore {
	static convertBatch (batch) {
		const nextLink = batch.getLink('batch-next');
		const loadNext = !nextLink || batch.Items.length < DEFAULT_SIZE ?
			null :
			async () => {
				const service = await getService();
				const nextBatch = await service.getBatch(nextLink);

				return UsersStore.convertBatch(nextBatch);
			};

		return {
			items: batch.Items,
			loadNext,
			total: batch.Total
		};
	}

	constructor () {
		super();

		this.set('items', []);
		this.set('loading', false);
	}

	async loadSearchTerm (term) {
		if(!term || term.length === 0) {
			this.load();
		}

		if (term.length < 3) {
			this.set('items', []);
			this.set('loading', false);
			this.emitChange('items', 'loading');

			return;
		}

		this.set('loading', true);
		this.emitChange('loading');

		const service = await getService();
		const link = service.getUserSearchURL(term);

		const batch = await service.getBatch(link, {batchSize: DEFAULT_SIZE, batchStart: 0});

		return UsersStore.convertBatch(batch);
	}

	async loadInitial () {
		if (this[INITIAL_LOAD_CACHE]) {
			return this[INITIAL_LOAD_CACHE];
		}

		this.set('loading', true);
		this.emitChange('loading');

		const service = await getService();
		const community = await User.resolve({entity: service.SiteCommunity});
		const membersLink = community.getLink('members');

		const batch = await service.getBatch(membersLink, {batchSize: DEFAULT_SIZE, batchStart: 0});

		const result = UsersStore.convertBatch(batch);

		this[INITIAL_LOAD_CACHE] = result;

		return result;
	}
}
