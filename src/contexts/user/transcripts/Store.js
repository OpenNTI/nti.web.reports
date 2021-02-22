import { getService } from '@nti/web-client';
import { Stores } from '@nti/lib-store';

export default class UserTranscript extends Stores.SimpleStore {
	constructor() {
		super();

		this.set('items', []);
		this.set('loading', false);
		this.set('error', null);
	}

	async loadTranscript(user) {
		this.set('items', []);
		this.set('loading', true);
		this.emitChange('loading', 'items');

		try {
			const link = user.getLink('UserEnrollments');

			if (link) {
				const service = await getService();
				const batch = await service.getBatch(link);

				this.set('items', batch.Items);
			} else {
				this.set('items', []);
			}

			this.set('loading', false);
			this.emitChange('loading', 'items');
		} catch (e) {
			this.set('error', e);
		}
	}
}
