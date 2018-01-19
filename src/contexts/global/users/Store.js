import {Stores} from 'nti-lib-store';
import {User, getService} from 'nti-web-client';

export default class UsersStore extends Stores.SearchablePagedStore {
	static convertBatch (batch) {
		const nextLink = batch.getLink('batch-next');
		const loadNext = !nextLink ?
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

		const batch = await service.getBatch(link);

		return UsersStore.convertBatch(batch);
	}

	async loadInitial () {
		this.set('loading', true);
		this.emitChange('loading');

		const service = await getService();
		const community = await User.resolve({entity: service.SiteCommunity});
		const membersLink = community.getLink('members');

		const batch = await service.getBatch(membersLink);

		return UsersStore.convertBatch(batch);
	}
}
