import './Item.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';

import Viewer from '../viewer';
import { getEmbedableType } from '../utils';

const DEFAULT_TEXT = {
	'application/pdf': 'PDF',
	'text/csv': 'CSV',
};
const t = scoped('web-reports.list.Item', DEFAULT_TEXT);

export default class ReportListItem extends React.Component {
	static propTypes = {
		report: PropTypes.object.isRequired,
		small: PropTypes.bool,
		onClick: PropTypes.func,
	};

	onClick = e => {
		e.preventDefault();
		const { report, onClick } = this.props;

		Viewer.show(report);
		onClick?.(e);
	};

	render() {
		const { report, small } = this.props;
		const anchorProps = {};

		if (getEmbedableType(report)) {
			anchorProps.href = '#';
			anchorProps.onClick = this.onClick;
		} else {
			anchorProps.href = report.href;
		}

		return (
			<a className={cx('report-list-item', { small })} {...anchorProps}>
				<div className="meta">
					<div className="labels">
						<div className="title">{report.title}</div>
						<div className="supports">
							{report.supportedTypes.map((type, index) => {
								return (
									<span key={index} className="type">
										{t(type)}
									</span>
								);
							})}
						</div>
					</div>
					<div className="description">{report.description}</div>
				</div>
				<div className="actions">
					<i className="icon-shareto" />
				</div>
			</a>
		);
	}
}
