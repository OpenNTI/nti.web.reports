import React from 'react';
import PropTypes from 'prop-types';
import {Presentation} from '@nti/web-commons';

export default class UserTranscriptReportContextItem extends React.Component {
	static propTypes = {
		item: PropTypes.object,
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
		const {title, label} = item.getPresentationProperties();

		return (
			<div className="user-transcript-report-context-item" onClick={this.onClick}>
				<Presentation.AssetBackground className="course-icon" contentPackage={item.CatalogEntry} type="landing" />
				<div className="meta">
					<div className="label">{label}</div>
					<div className="title">{title}</div>
				</div>
			</div>
		);
	}
}
