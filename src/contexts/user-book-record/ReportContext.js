import ReportContext from '../abstract/ReportContext';
import ContextRegistry from '../ContextRegistry';

@ContextRegistry.register('application/vnd.nextthought.userbundlerecord')
export default class UserBundleRecordContext extends ReportContext {
	groups = [
		{
			reports: [
				{ rel: 'report-UserBookProgressReport'}
			]
		}
	]
}
