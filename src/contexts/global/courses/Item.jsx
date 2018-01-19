import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Presentation} from 'nti-web-commons';

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

		const catalogEntry = item.CatalogEntry;

		const className = cx('report-course-item', { disabled: !item.Reports });

		return (
			<div className={className} onClick={this.onClick}>
				<Presentation.AssetBackground className="course-image" contentPackage={catalogEntry} type="landing"/>
				<div className="course-info">
					<div className="identifier">{catalogEntry.ProviderUniqueID}</div>
					<div className="title">{catalogEntry.Title}</div>
				</div>
			</div>
		);
	}
}
