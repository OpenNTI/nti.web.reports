const EMBEDABLE_TYPES = {
	'application/pdf': true,
};

export default function getEmbedableType(report) {
	const { supportedTypes } = report;

	for (let supportedType of supportedTypes) {
		if (EMBEDABLE_TYPES[supportedType]) {
			return supportedType;
		}
	}

	return null;
}
