import ReportContext from '../abstract/ReportContext';
import ContextRegistry from '../ContextRegistry';

@ContextRegistry.register('application/vnd.nextthought.courses.courseinstance')
export default class CourseInstanceContext extends ReportContext {
	groups = [
		{
			reports: [
				{rel: 'report-CourseSummaryReport.pdf'},
				{rel: 'report-SelfAssessmentSummaryReport.pdf'},
				{rel: 'report-CourseRosterReport'},
				{rel: 'report-AssignmentSummaryReport.pdf', contextID: 'course-assignments'},
				{rel: 'report-SelfAssessmentReportCSV'}
			]
		}
	]


	subContexts = {
		'IQAssignment': {name: 'Assignments', id: 'course-assignments'}
	}

}
