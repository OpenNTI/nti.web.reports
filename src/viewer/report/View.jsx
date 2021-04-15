import React from 'react';
import PropTypes from 'prop-types';


import Controls from './Controls';
import Preview from './Preview';


ReportView.propTypes = {
	report: PropTypes.object.isRequired
};
export default function ReportView ({report}) {
	const [previewSrc, setPreviewSrc] = React.useState(null);

	return (
		<>
			<Controls report={report} previewSrc={previewSrc} setPreviewSrc={setPreviewSrc} />
			<Preview src={previewSrc} />
		</>
	);
}
