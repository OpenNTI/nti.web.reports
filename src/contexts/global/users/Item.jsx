import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Avatar, DisplayName} from '@nti/web-commons';

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
		const {item} = this.props;

		const className = cx('report-user-item', { disabled: !item.Reports });

		return (
			<div className={className} onClick={this.onClick}>
				<Avatar className="user-avatar" entity={item}/>
				<div className="user-info">
					<DisplayName entity={item}/>
				</div>
			</div>
		);
	}
}
