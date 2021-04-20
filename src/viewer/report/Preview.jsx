import React from 'react';
import PropTypes from 'prop-types';

import {scoped} from '@nti/lib-locale';
import { Loading, Errors } from '@nti/web-commons';

const t = scoped('web-reports.viewer.report.Preview', {
	generating: 'Generating'
});

const Wrapper = styled.div`
	position: relative;
	background: white;
	width: 100%;
	height: calc(98vh - 140px);
`;

const Iframe = styled('iframe')`
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;
	border: none;
`;

function getIframeSrc (src) {
	const url = new URL(src);

	url.hash = 'view=FitH&toolbar=0&navpanes=0&statusbar=0&page=1';

	return url.toString();
}



ReportPreview.propTypes = {
	src: PropTypes.string
};
export default function ReportPreview ({src}) {
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState(null);

	React.useEffect(() => {
		setLoading(Boolean(src));
		setError(null);
	}, [src]);

	if (!src) { return null; }

	return (
		<Wrapper>
			{error && (<Errors.Message error={error} />)}
			{src && (
				<Iframe src={getIframeSrc(src)} onLoad={() => setLoading(false)} onError={setError} />
			)}
			<Loading.Overlay loading={loading} label={t('generating')} />
		</Wrapper>
	);
}
