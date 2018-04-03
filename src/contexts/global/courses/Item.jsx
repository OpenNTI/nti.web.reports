import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {getService} from 'nti-web-client';
import {Presentation} from 'nti-web-commons';

export default class ReportCourseInstanceAssignmentItem extends React.Component {
	static propTypes = {
		item: PropTypes.object.isRequired,
		rel: PropTypes.string,
		onSelect: PropTypes.func
	}

	state = {disabled: true}


	componentDidUpdate (prevProps) {
		if (prevProps.item !== this.props.item) {
			this.setupFor(this.props);
		}
	}


	componentDidMount () {
		this.setupFor(this.props);
	}


	async setupFor (props) {
		const {item} = this.props;

		try {
			const service = await getService();
			const course = await service.getObject(item.CourseInstance);

			this.setState({course, disabled: !course.Reports});
		} catch (e) {
			//its okay if this fails, the item will just be disabled
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
		const {disabled} = this.state;
		const {item} = this.props;

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
