import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { Text, Icons, Flyout, List } from '@nti/web-commons';
import { Button } from '@nti/web-core';

import ParamInputs from './parameters/Inputs';

const t = scoped('web-reports.viewer.report.Download', {
	labels: {
		download: 'Download Report',
		'application/pdf': 'Download PDF',
		'text/csv': 'Download CSV',
	},
	types: {
		'application/pdf': 'PDF',
		'text/csv': 'CSV',
	},
});

const getType = ({ format }) => t(`types.${format}`);
const getLabel = ({ format }) => t(`labels.${format}`);

const Trigger = styled(Button).attrs({ rounded: true })`
	display: inline-flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;

	& > i {
		margin-left: 0.25rem;
	}
`;

const Link = styled('a')`
	display: block;
	font-size: 0.875;
	text-decoration: none;
	color: var(--primary-blue);
	cursor: pointer;
	padding: 0.5rem;
`;

function getDownloadOptions(report, params) {
	const { supportedTypes } = report;
	const values = ParamInputs.getParamValues(params);

	return (supportedTypes ?? []).map(format => {
		const url = new URL(report.href, global.location?.origin);

		url.searchParams.set('format', format);

		for (let [key, value] of Object.entries(values)) {
			url.searchParams.set(key, value);
		}

		return { format, href: url.toString() };
	});
}

ReportDownload.propTypes = {
	report: PropTypes.shape({
		href: PropTypes.string,
		supportedTypes: PropTypes.array,
	}),
	params: PropTypes.object,
	onDownloadStarted: PropTypes.func,
};
export default function ReportDownload({
	report,
	params,
	onDownloadStarted = () => {},
}) {
	const options = useMemo(
		() => getDownloadOptions(report, params),
		[report, params]
	);

	if (options.length === 0) {
		return null;
	}

	if (options.length === 1) {
		return (
			<Trigger
				href={options[0].href}
				download
				onClick={() => onDownloadStarted(getType(options[0]))}
			>
				{getLabel(options[0])}
			</Trigger>
		);
	}

	const trigger = (
		<Trigger>
			<Text.Base>{t('labels.download')}</Text.Base>
			<Icons.Chevron.Down />
		</Trigger>
	);

	return (
		<Flyout.Triggered trigger={trigger} autoDismissOnAction>
			<div>
				<List.Unadorned>
					{options.map(option => (
						<Link
							key={option.format}
							href={option.href}
							download
							onClick={() => onDownloadStarted(getType(option))}
						>
							{getLabel(option)}
						</Link>
					))}
				</List.Unadorned>
			</div>
		</Flyout.Triggered>
	);
}
