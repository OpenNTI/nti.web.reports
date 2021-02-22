import ReportContext from '../abstract/ReportContext';
import ContextRegistry from '../ContextRegistry';

export default class UserBundleRecordContext extends ReportContext {
	groups = [
		{
			reports: [{ rel: 'report-UserBookProgressReport' }],
		},
	];
}

ContextRegistry.register('application/vnd.nextthought.userbundlerecord')(
	UserBundleRecordContext
);
