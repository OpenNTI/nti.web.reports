import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Presentation, Hooks} from '@nti/web-commons';

const {useResolver} = Hooks;
const {isResolved} = useResolver;

function containsReport (item, rel) {
	if (rel && item.Reports) {
		return item.Reports.some(x => x.rel === rel);
	}

	return false;
}

async function findContainer (item, rel) {
	if (containsReport(item, rel)) { return rel; }

	const course = await item.fetchLinkParsed('CourseInstance');

	return containsReport(course, rel) ? course : null; 
}

ReportCourseInstanceItem.propTypes = {
	item: PropTypes.object.isRequired,
	rel: PropTypes.string,
	onSelect: PropTypes.func
};
export default function ReportCourseInstanceItem ({item, rel, onSelect}) {
	const resolver = useResolver(() => findContainer(item, rel), [item.NTIID, rel]);

	const container = isResolved(resolver) ? resolver : null;
	const disabled = !container;

	const onClick = () => {
		if (onSelect && container) {
			onSelect(container);
		}
	};

	const {CatalogEntry} = item;

	return (
		<div className={cx('report-course-item', {disabled})} onClick={onClick}>
			<Presentation.AssetBackground className="course-image" contentPackage={CatalogEntry} type="landing"/>
			<div className="course-info">
				<div className="identifier">{CatalogEntry.ProviderUniqueID}</div>
				<div className="title">{CatalogEntry.Title}</div>
			</div>
		</div>
	);
}
