import ReportContext from '../abstract/ReportContext';
import ContextRegistry from '../ContextRegistry';

@ContextRegistry.register('application/vnd.nextthought.contentpackagebundle')
export default class ContentPackageBundleContext extends ReportContext {
	groups = [
		{
			reports: [
				{ rel: 'report-IFSTASampleSummary' },
				{ rel: 'report-IFSTASampleDetail' },
				{ rel: 'report-IFSTASampleConcepts' }
			]
		}
	]
}
