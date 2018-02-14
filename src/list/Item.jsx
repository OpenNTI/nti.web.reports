import React from 'react';
import PropTypes from 'prop-types';

import Viewer from '../viewer';

export default class ReportListItem extends React.Component {
	static propTypes = {
		report: PropTypes.object.isRequired
	}


	onClick = (e) => {
		e.preventDefault();
		const {report} = this.props;

		Viewer.show(report);
	}


	render () {
		const {report} = this.props;
		const anchorProps = {};

		if (report.supportedTypes.indexOf('pdf') >= 0) {
			anchorProps.href = '#';
			anchorProps.onClick = this.onClick;
		} else {
			anchorProps.href = report.href;
		}

		return (
			<a className="report-list-item" {...anchorProps}>
				<div className="meta">
					<div className="labels">
						<div className="title">
							{report.title}
						</div>
						<div className="supports">
							{report.supportedTypes.map((type, index) => {
								return (
									<span key={index} className="type">
										{type}
									</span>
								);
							})}
						</div>
					</div>
					<div className="description">
						{report.description}
					</div>
				</div>
				<div className="actions">
					<i className="icon-shareto" />
				</div>
			</a>
		);
	}
}
