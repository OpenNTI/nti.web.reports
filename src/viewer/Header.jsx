import './Header.scss';
import React from 'react';
import PropTypes from 'prop-types';

export default class ReportViewerHeader extends React.Component {
	static propTypes = {
		report: PropTypes.object,
		context: PropTypes.object,

		onDismiss: PropTypes.func,
		onBackToContext: PropTypes.func,
	};



	onBack = () => {
		const { onBackToContext } = this.props;

		if (onBackToContext) {
			onBackToContext();
		}
	};

	onDismiss = () => {
		const { onDismiss } = this.props;

		if (onDismiss) {
			onDismiss();
		}
	};

	render() {
		return (
			<div className="report-viewer-header">
				{this.renderBack()}
				{this.renderTitle()}
				{this.renderDismiss()}
			</div>
		);
	}

	renderBack() {
		const { report, context } = this.props;

		//if we don't have a report and we have context that means we haven't drilled in
		//if we don't have context there's never a need to show back

		return (
			<div className="back-container">
				{report && context && (
					<i
						className="back icon-chevronup-25"
						onClick={this.onBack}
					/>
				)}
			</div>
		);
	}

	renderTitle() {
		const { report, context } = this.props;

		return (
			<div className="title">
				{report && report.title}
				{!report && context && context.title}
			</div>
		);
	}

	renderDismiss() {
		return <i className="icon-light-x dismiss" onClick={this.onDismiss} />;
	}
}
