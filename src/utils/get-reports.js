import {getService} from '@nti/web-client';

const ALL_REPORTS_LINK = '/dataserver2/reporting/reports';

const map = new WeakMap();

export default async function getAllReports () {
	let reports = map.get(getAllReports);

	if (reports) { return reports.Items; }

	try {
		const service = await getService();
		reports = await service.getBatch(ALL_REPORTS_LINK);

		map.set(getAllReports, reports);

		return reports.Items;
	} catch (e) {
		return [];
	}
}
