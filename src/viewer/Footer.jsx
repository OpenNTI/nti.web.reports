import React from 'react';
import PropTypes from 'prop-types';
import { DialogButtons } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

const DEFAULT_TEXT = {
	done: 'Done',
};
const t = scoped('web-reports.viewer.Footer', DEFAULT_TEXT);

const styles = stylesheet`
	.footer {
		background: white;
	}
`;

export default class ReportViewerFooter extends React.Component {
	static propTypes = {
		onDismiss: PropTypes.func,
	};

	buttons = [
		{
			label: t('done'),
			onClick: x => this.onDismiss(x),
			'data-testid': 'dismiss-report-viewer',
		},
	];

	onDismiss = () => {
		const { onDismiss } = this.props;

		if (onDismiss) {
			onDismiss();
		}
	};

	render() {
		return (
			<div className={styles.footer}>
				<DialogButtons buttons={this.buttons} />
			</div>
		);
	}
}
