import ReportContext from '../abstract/ReportContext';
import ContextRegistry from '../ContextRegistry';

@ContextRegistry.register('application/vnd.nextthought.courses.courseinstance')
export default class CourseInstanceContext extends ReportContext {
	groups = [
		{
			reports: [
				{rel: 'report-CourseSummaryReport.pdf'},
				{rel: 'report-SelfAssessmentSummaryReport.pdf'},
				{rel: 'report-CourseRosterReport.pdf'},
				{rel: 'report-AssignmentSummaryReport.pdf', contextID: 'course-assignments'}
			]
		}
	]


	subContexts = {
		'IQAssignment': {name: 'Assignments', id: 'course-assignments'}
	}

}
