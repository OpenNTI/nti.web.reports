import ReportContext from '../abstract/ReportContext';
import ContextRegistry from '../ContextRegistry';

export default class ContentPackageBundleContext extends ReportContext {
	groups = [
		{
			reports: [
				{ rel: 'report-BookProgressReport' },
				{ rel: 'report-IFSTASampleDetail' },
				{ rel: 'report-IFSTASampleConcepts' },
				{ rel: 'report-BookConceptReport' },
				{
					rel: 'report-UserBookProgressReport',
					contextID: 'contentpackage-bundle-roster',
				},
			],
		},
	];

	subContexts = {
		IUserBundleRecord: {
			name: 'Users',
			id: 'contentpackage-bundle-roster',
		},
	};
}

ContextRegistry.register([
	'application/vnd.nextthought.contentpackagebundle',
	'application/vnd.nextthought.publishablecontentpackagebundle',
])(ContentPackageBundleContext);
