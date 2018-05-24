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
				{rel: 'report-SelfAssessmentReportCSV'},
				{rel: 'report-ForumParticipationReport.pdf', contextID: 'course-forums'}
				// {rel: 'report-InquiryReport.pdf', contextID: 'course-inquiries'} //Leave this off for now
			]
		}
	]


	subContexts = {
		'IQAssignment': {name: 'Assignments', id: 'course-assignments'},
		'ICommunityForum': {name: 'Forums', id: 'course-forums'},
		// 'IQInquiry': {name: 'Polls', id: 'course-inquiries', shouldShow: course => course.hasLink('Inquiries')} //Leave this off for now
	}

}
