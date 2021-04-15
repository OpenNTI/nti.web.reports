import ReportContext from '../abstract/ReportContext';
import ContentRegistry from '../ContextRegistry';

export default class GlobalContext extends ReportContext {
	groups = [
		{
			reports: [
				{
					rel: 'report-CourseSummaryReport.pdf',
					contextID: 'course-instance',
				},
				{
					rel: 'report-SelfAssessmentSummaryReport.pdf',
					contextID: 'course-instance',
				},
				{
					rel: 'report-CourseRosterReport',
					contextID: 'course-instance',
				},
				{ rel: 'report-UserEnrollmentReport', contextID: 'user' },
				{
					rel: 'report-AllCourseRosterReport',
					resolve: (service, reports) => {
						const workspace = service.getWorkspace('Courses');
						const href =
							workspace &&
							workspace.getLink('AllCourseRosterReport');

						if (!href) {
							return null;
						}

						for (let report of reports) {
							if (report.rel === 'report-AllCourseRosterReport') {
								return {
									title: report.title,
									description: report.description,
									supportedTypes: report.supportedTypes,
									rel: report.rel,
									acceptedParameters: ['completionNotBefore', 'completionNotAfter'],
									href,
								};
							}
						}
					},
				},
			],
		},
	];

	subContexts = {
		ICourseInstance: { name: 'Courses', id: 'course-instance' },
		IUser: { name: 'Users', id: 'user' },
	};

	canAccessReports() {
		return true;
	}

	getContextReports() {
		return [];
	}
}

ContentRegistry.register('application/vnd.nextthought.service')(GlobalContext);
