import React from 'react';
import PropTypes from 'prop-types';


import Controls from './Controls';
import Preview from './Preview';


ReportView.propTypes = {
	report: PropTypes.object.isRequired,
	context: PropTypes.object,
	setTitle: PropTypes.func
};
export default function ReportView ({report, context, setTitle}) {
	const [previewSrc, setPreviewSrc] = React.useState(null);

	return (
		<>
			<Controls report={report} previewSrc={previewSrc} setPreviewSrc={setPreviewSrc} context={context} setTitle={setTitle} />
			<Preview src={previewSrc} />
		</>
	);
}
