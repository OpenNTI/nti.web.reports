import './Item.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {DateTime} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import {getReport} from '../../../utils';


const DEFAULT_TEXT = {
	due: 'Due ',
	available: 'Available ',
	noDates: 'No Dates Set'
};
const t = scoped('web-reports.context.course-instance.assignments.Item', DEFAULT_TEXT);

export default class ReportCourseInstanceAssignmentItem extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
		rel: PropTypes.string,
		onSelect: PropTypes.func
	}


	onClick = () => {
		const {item, onSelect} = this.props;

		if (onSelect) {
			onSelect(item);
		}
	}


	render () {
		const {item, rel} = this.props;
		const disabled = !getReport(rel, item);
		const dateFormat = 'dddd, MMMM D, h:mm a z';
		const start = item.getAvailableForSubmissionBeginning();
		const due = item.getDueDate();

		return (
			<div className={cx('report-course-instance-assignment-item', {disabled})} onClick={this.onClick}>
				<div className="title">{item.title}</div>
				{
					due ?
						(<div className="date"><span>{t('due')}</span><DateTime date={due} format={dateFormat} /></div>) :
						start ?
							(<div className="date"><span>{t('available')}</span><DateTime date={start} format={dateFormat} /></div>) :
							(<div className="no-date">{t('noDates')}</div>)

				}
			</div>
		);
	}
}
