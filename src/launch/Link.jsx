import { useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';

import { scoped } from '@nti/lib-locale';
import { Text, Flyout } from '@nti/web-commons';
import { Icons } from '@nti/web-core';

import View from '../viewer';
import Item from '../list/Item';

import Styles from './Link.css';

const cx = classnames.bind(Styles);
const t = scoped('nti.web.reports.launch.Link', {
	viewReports: {
		one: 'View Report',
		other: 'View Reports',
	},
});

function getReports({ report, context }) {
	if (report) {
		return Array.isArray(report) ? report : [report];
	}

	return context?.Reports ?? [];
}

ReportLink.propTypes = {
	className: PropTypes.string,

	report: PropTypes.object,
	context: PropTypes.shape({
		Reports: PropTypes.array,
	}),

	children: PropTypes.any,
};
export default function ReportLink(props) {
	const { className, children } = props;

	const flyout = useRef();
	const dismiss = () => flyout.current?.dismiss();

	const reports = getReports(props);

	if (reports.length === 0) {
		return null;
	}

	const single = reports.length === 1;
	const showOnlyReport = single
		? () => (View.show(reports[0]), dismiss())
		: null;

	const trigger = (
		<a
			className={cx('report-link', className)}
			role="button"
			onClick={showOnlyReport}
		>
			<Icons.Report className={cx('icon')} />
			<Text.Base>
				{children ?? t('viewReports', { count: reports.length })}
			</Text.Base>
		</a>
	);

	return single ? (
		trigger
	) : (
		<Flyout.Triggered
			ref={flyout}
			trigger={trigger}
			horizontalAlign={Flyout.ALIGNMENTS.LEFT_OR_RIGHT}
		>
			<ul className={cx('report-link-flyout-list')}>
				{reports.map((r, key) => (
					<li key={key}>
						<Item report={r} small onClick={dismiss} />
					</li>
				))}
			</ul>
		</Flyout.Triggered>
	);
}
