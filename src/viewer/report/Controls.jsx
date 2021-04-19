import React from 'react';
import PropTypes from 'prop-types';

import {scoped} from '@nti/lib-locale';
import { usePersistentState, Button, Toast } from '@nti/web-commons';

import { getEmbedableType } from '../../utils';

import Download from './Download';
import ParamInputs from './parameters/Inputs';

const t = scoped('web-reports.viewer.report.Controls', {
	preview: {
		generate: 'Generate Preview',
		regenerate: 'Regenerate Preview'
	},
	downloading: {
		title: 'Generating %(type)s Report:',
		message: 'The report will begin downloading soon.'
	}
});

function buildPreviewSrc (report, params, format) {
	const url = new URL(report.href, global.location?.origin);

	if (format) {
		url.searchParams.set('format', format);
	}

	for (let [key, value] of Object.entries(params)) {
		url.searchParams.set(key, value);
	}

	return url.toString();
}

const Controls = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: flex-end;
	background: var(--panel-background);
	border-bottom: 1px solid var(--border-grey-light);
	padding: 0.5rem;

	& > * {
		margin: 0 0.25rem;
	}
`;

const Params = styled.div`
	flex: 1 1 auto;
`;

const Preview = styled(Button)`
	color: var(--primary-blue);
	cursor: pointer;

	&:focused {
		text-decoration: underline;
	}
`;

const Messages = styled.div`
	position: relative;
`;

ReportControls.propTypes = {
	report: PropTypes.shape({
		supportedTypes: PropTypes.array,
		rel: PropTypes.string
	}),

	previewSrc: PropTypes.string,
	setPreviewSrc: PropTypes.func
};
export default function ReportControls ({report, previewSrc, setPreviewSrc}) {
	const [rawParams, setRawParams] = usePersistentState(report.rel);
	const params = React.useMemo(() => rawParams ? JSON.parse(rawParams) : {}, [rawParams]);
	const setParams = x => setRawParams(JSON.stringify(x));

	const [error, setError] = React.useState(null);

	const [downloads, setDownloads] = React.useState([]);

	const embedableType = getEmbedableType(report);

	const updatePreview = () => {
		try {
			setPreviewSrc(buildPreviewSrc(report, params, embedableType));
		} catch (e) {
			setError(e);
		}
	};

	const onDownloadStarted = (type) => setDownloads(Array.from(new Set([...downloads, type])));
	const dismissDownload = (type) => setDownloads(downloads.filter(existing => existing !== type));

	return (
		<>
			<Controls>
				<Params>
					<ParamInputs report={report} params={params} onChange={setParams} />
				</Params>

				{embedableType && (
					<Preview onClick={updatePreview} rounded plain>
						{previewSrc ? t('preview.regenerate') : t('preview.generate')}
					</Preview>
				)}
				<Download params={params} report={report} onDownloadStarted={onDownloadStarted} />
			</Controls>
			<Messages>
				<Toast.Container location={Toast.Locations.Top}>
					{error && (<Toast.ErrorBar error={error} onDismiss={() => setError(null)}/>)}
					{downloads.map((type) => (
						<Toast.MessageBar
							key={type}
							title={t('downloading.title', {type})}
							message={t('downloading.message')}
							onDismiss={() => dismissDownload(type)}
						/>
					))}
				</Toast.Container>
			</Messages>
		</>
	);
}
