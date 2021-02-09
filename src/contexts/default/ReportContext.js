import ReportContext from '../abstract/ReportContext';
import ContextRegistry from '../ContextRegistry';

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

ContextRegistry.register(ContextRegistry.DEFAULT)(DefaultReportContext);
