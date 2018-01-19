import ReportContext from '../abstract/ReportContext';
import ContextRegistry from '../ContextRegistry';

@ContextRegistry.register(ContextRegistry.DEFAULT)
export default class DefaultReportContext extends ReportContext {
	getReportGroups () {
		const reports = this.getContextReports();

		return [{
			name: '',
			description: '',
			reports
		}];
	}
}
