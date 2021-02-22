export default function getReport(rel, context) {
	const reports = context?.Reports || [];

	for (let report of reports) {
		if (report.rel === rel) {
			return report;
		}
	}
}
