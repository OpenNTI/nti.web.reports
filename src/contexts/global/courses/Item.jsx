import './Item.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Presentation } from '@nti/web-commons';

function containsReport(item, rel) {
	if (rel && item.Reports) {
		return item.Reports.some(x => x.rel === rel);
	}

	return false;
}

ReportCourseInstanceItem.propTypes = {
	item: PropTypes.object.isRequired,
	rel: PropTypes.string,
	onSelect: PropTypes.func,
};
export default function ReportCourseInstanceItem({ item, rel, onSelect }) {
	const disabled = !containsReport(item, rel);

	const onClick = () => {
		if (onSelect && containsReport(item, rel)) {
			onSelect(item);
		}
	};

	const { CatalogEntry } = item;

	return (
		<div
			className={cx('report-course-item', { disabled })}
			onClick={onClick}
		>
			<Presentation.AssetBackground
				className="course-image"
				contentPackage={CatalogEntry}
				type="landing"
			/>
			<div className="course-info">
				<div className="identifier">
					{CatalogEntry.ProviderUniqueID}
				</div>
				<div className="title">{CatalogEntry.Title}</div>
			</div>
		</div>
	);
}
