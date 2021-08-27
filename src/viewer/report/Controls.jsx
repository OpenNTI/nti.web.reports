import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { usePersistentState, Toast, Text } from '@nti/web-commons';
import { Button } from '@nti/web-core';

import { getEmbedableType } from '../../utils';

import Download from './Download';
import ParamInputs from './parameters/Inputs';

const t = scoped('web-reports.viewer.report.Controls', {
	title: 'Report Options',
	preview: {
		generate: 'Generate Preview',
		regenerate: 'Regenerate Preview',
	},
	downloading: {
		title: 'Generating %(type)s Report:',
		message: 'The report will begin downloading soon.',
	},
});

function buildPreviewSrc(report, params, format) {
	const url = new URL(report.href, global.location?.origin);
	const paramValues = ParamInputs.getParamValues(params);

	if (format) {
		url.searchParams.set('format', format);
	}

	for (let [key, value] of Object.entries(paramValues)) {
		url.searchParams.set(key, value);
	}

	url.searchParams.set('t', Date.now());

	return url.toString();
}

const Controls = styled.div`
	position: relative;
	display: flex;
	flex-direction: row;
	align-items: center;
	background: var(--panel-background);
	border-bottom: 1px solid var(--border-grey-light);
	padding: 0.5rem;

	&.full {
		min-height: calc(100vh - 100px);
		flex-direction: column;
	}
`;

const Info = styled.div`
	text-align: center;
	margin-top: 3rem;
	margin-bottom: 2rem;
	color: var(--secondary-grey);
`;

const Title = styled(Text.Base)`
	font-size: 1.25rem;
`;

const Description = styled(Text.Base).attrs({ as: 'p' })``;

const Params = styled.div`
	flex: 1 1 auto;

	&.full {
		flex: 0 0 auto;
		margin-bottom: 1rem;
	}
`;

const Buttons = styled.div`
	flex: 0 0 auto;

	& > * {
		margin: 0 0.25rem;
	}
`;

const Preview = styled(Button)`
	color: var(--primary-blue);
	cursor: pointer;
`;

const Messages = styled.div`
	position: absolute;
	top: 100%;
	left: 0;
	width: 100%;

	&.full {
		top: 0;
	}
`;

ReportControls.propTypes = {
	report: PropTypes.shape({
		supportedTypes: PropTypes.array,
		rel: PropTypes.string,
		title: PropTypes.string,
		description: PropTypes.string,
		getLongDescription: PropTypes.func,
	}),
	context: PropTypes.object,

	previewSrc: PropTypes.string,
	setPreviewSrc: PropTypes.func,

	setTitle: PropTypes.func,
};
export default function ReportControls({
	report,
	previewSrc,
	setPreviewSrc,
	context,
	setTitle,
}) {
	const [rawParams, setRawParams] = usePersistentState(
		`${report.rel}-parameters`,
		ParamInputs.defaultParams
	);
	const params = React.useMemo(
		() =>
			typeof rawParams === 'string'
				? JSON.parse(rawParams)
				: rawParams ?? {},
		[rawParams]
	);
	const setParams = x => setRawParams(JSON.stringify(x));

	const [error, setError] = React.useState(null);
	const [downloads, setDownloads] = React.useState([]);

	React.useEffect(() => {
		setTitle(previewSrc ? report.title : t('title'));
	}, [previewSrc]);

	const embedableType = getEmbedableType(report);

	const updatePreview = () => {
		try {
			setPreviewSrc(buildPreviewSrc(report, params, embedableType));
		} catch (e) {
			setError(e);
		}
	};

	const onDownloadStarted = type =>
		setDownloads(Array.from(new Set([...downloads, type])));
	const dismissDownload = type =>
		setDownloads(downloads.filter(existing => existing !== type));

	const full = !previewSrc;

	return (
		<Controls full={full}>
			{full && (
				<Info>
					<Title>{report.title}</Title>
					<Description>
						{report.getLongDescription
							? report.getLongDescription(context)
							: report.description}
					</Description>
				</Info>
			)}

			<Params full={full}>
				<ParamInputs
					report={report}
					params={params}
					onChange={setParams}
				/>
			</Params>

			<Buttons full={full}>
				{embedableType && (
					<Preview onClick={updatePreview} rounded transparent>
						{previewSrc
							? t('preview.regenerate')
							: t('preview.generate')}
					</Preview>
				)}
				<Download
					params={params}
					report={report}
					onDownloadStarted={onDownloadStarted}
				/>
			</Buttons>
			<Messages full={full}>
				<Toast.Container location={Toast.Locations.Top}>
					{error && (
						<Toast.ErrorBar
							error={error}
							onDismiss={() => setError(null)}
						/>
					)}
					{downloads.map(type => (
						<Toast.MessageBar
							key={type}
							title={t('downloading.title', { type })}
							message={t('downloading.message')}
							onDismiss={() => dismissDownload(type)}
						/>
					))}
				</Toast.Container>
			</Messages>
		</Controls>
	);
}
