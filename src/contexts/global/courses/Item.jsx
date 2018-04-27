import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Presentation} from '@nti/web-commons';

export default class ReportCourseInstanceAssignmentItem extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
		rel: PropTypes.string,
		onSelect: PropTypes.func
	}

	state = {}

	componentDidMount () {
		const {item} = this.props;

		this.setup(item);
	}


	componentDidUpdate (oldProps) {
		if(oldProps.item.NTIID !== this.props.item.NTIID) {
			this.setup(this.props.item);
		}
	}


	setup (item) {
		const disabled = !item.Reports;

		this.setState({ disabled });

		// not worth loading course instance to check Reports if we know there are
		// at least some Reports from the enrollment record, so just check if initially disabled
		if(disabled) {
			item.fetchLinkParsed('CourseInstance').then(course => {
				this.setState({
					course,
					disabled: !course.Reports
				});
			});
		}
	}

	onClick = () => {
		const {course} = this.state;
		const {onSelect} = this.props;

		if (onSelect) {
			onSelect(course);
		}
	}


	render () {
		const {item} = this.props;
		const {disabled} = this.state;

		const catalogEntry = item.CatalogEntry;

		const className = cx('report-course-item', { disabled });

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
