import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import cx from 'classnames';

export const LARGE = 'large-header';
export const MEDIUM = 'medium-header';
export const SMALL = 'small-header';

export default class OutlineChartRow extends React.Component {
	static propTypes = {
		percent: PropTypes.number,
		text: PropTypes.string.isRequired,
		size: PropTypes.oneOf([LARGE, MEDIUM, SMALL])
	}

	render () {
		const {percent, text, size} = this.props;

		const cls = cx('outline-chart-row', size || SMALL);

		return (
			<div className={cls}>
				<div className="percentage-bar">
					<div className="bar" style={{width: (percent || 0) + '%'}}/>
				</div>
				<div className="text-content">{text}</div>
			</div>
		);
	}
}
