import ReportContext from '../abstract/ReportContext';
import ContextRegistry from '../ContextRegistry';

@ContextRegistry.register('application/vnd.nextthought.contentpackagebundle')
export default class ContentPackageBundleContext extends ReportContext {
	groups = [
		{
			reports: [
				{ rel: 'report-BookProgressReport'},
				{ rel: 'report-IFSTASampleDetail' },
				{ rel: 'report-IFSTASampleConcepts' },
				{ rel: 'report-UserBookProgressReport', contextID: 'contentpackage-bundle-roster'}
			]
		}
	]


	subContexts = {
		'IUserBundleRecord': {name: 'Users', id: 'contentpackage-bundle-roster'}
	}
}
