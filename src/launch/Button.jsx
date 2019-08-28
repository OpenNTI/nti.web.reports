import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import View from '../viewer';

import Styles from './Button.css';

const cx = classnames.bind(Styles);

export default class ReportLaunchButton extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		report: PropTypes.object
	}

	launchReport = (e) => {
		e.stopPropagation();
		e.preventDefault();

		const {report} = this.props;

		View.show(report);
	}

	render () {
		const {className, report} = this.props;

		if (!report) { return null; }

		//report-button is a style hook, don't add it to Button.css
		return (
			<button type="button" className={cx('report-launch-button', 'report-button', className)} onClick={this.launchReport}>
				<i className={cx('icon-report', 'icon')} />
			</button>
		);
	}

}
