import { getService } from '@nti/web-client';

const ALL_REPORTS_LINK = '/dataserver2/reporting/reports';

const map = new WeakMap();

export default async function getReports() {
	let reports = map.get(getReports);

	if (reports) {
		return reports.Items;
	}

	try {
		const service = await getService();
		reports = await service.getBatch(ALL_REPORTS_LINK);

		map.set(getReports, reports);

		return reports.Items;
	} catch (e) {
		return [];
	}
}
