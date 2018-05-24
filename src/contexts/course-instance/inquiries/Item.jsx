import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {getReportFrom} from '../../../utils';


export default class ReportCourseInstanceInquiryItem extends React.Component {
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
		const disabled = !getReportFrom(rel, item);


		return (
			<div className={cx('report-course-instance-inquiry-item', {disabled})} onClick={this.onClick}>
				<div className="title">{item.title}</div>
			</div>
		);
	}
}
