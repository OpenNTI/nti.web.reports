import {getService} from '@nti/web-client';
import {Stores} from '@nti/lib-store';

const PAGE_SIZE = 20;

export default class ContentPackageBundleRosterStore extends Stores.BoundStore {
	async load (page) {
		if (!this.binding) { return; }

		this.set({
			loading: true,
			error: false
		});

		const params = {batchSize: PAGE_SIZE, batchStart: 0};

		try {
			const service = await getService();
			const result = await service.getBatch(this.binding.getLink('users'), params);

			this.set({
				loading: false,
				loaded: true,
				lastPage: 0,
				items: result.Items,
				hasMore: result.Items.length >= PAGE_SIZE
			});

		} catch (e) {
			this.set({
				loading: false,
				loaded: true,
				error: true,
				items: [],
				hasMore: false
			});
		}
	}


	async loadNextPage () {
		const lastPage = this.get('lastPage');
		const items = this.get('items');

		this.set({
			loading: true,
			error: false
		});

		const batchStart = ((lastPage || 0) + 1) * PAGE_SIZE;
		const params = {batchSize: PAGE_SIZE, batchStart};

		try {
			const service = await getService();
			const result = await service.getBatch(this.binding.getLink('users'), params);

			this.set({
				loading: false,
				lastPage: (lastPage || 0) + 1,
				items: [...items, ...result.Items],
				hasMore: result.Items.length >= PAGE_SIZE
			});
		} catch (e) {
			this.set({
				loading: false,
				error: true,
				hasMore: false
			});
		}
	}
}
