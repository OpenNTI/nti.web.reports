import ReportContext from '../abstract/ReportContext';
import ContextRegistry from '../ContextRegistry';

export default class UserContext extends ReportContext {
	groups = [
		{
			reports: [
				{ rel: 'report-UserEnrollmentReport.pdf' },
				{
					rel: 'report-StudentParticipationReport.pdf',
					contextID: 'user-transcripts',
				},
			],
		},
	];

	subContexts = {
		ICourseInstanceEnrollment: {
			name: 'User Transcript',
			id: 'user-transcripts',
		},
	};
}

ContextRegistry.register('application/vnd.nextthought.user')(UserContext);
