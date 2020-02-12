import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Flyout, Toast} from '@nti/web-commons';

const DEFAULT_TEXT = {
	download: 'Download',
	'application/pdf': 'PDF',
	'text/csv': 'CSV',
	downloading: {
		title: 'Generating %(type)s Report:',
		message: 'The report will begin downloading soon.'
	}
};
const t = scoped('web-reports.viewer.Header', DEFAULT_TEXT);

export default class ReportViewerHeader extends React.Component {
	static propTypes = {
		report: PropTypes.object,
		context: PropTypes.object,

		onDismiss: PropTypes.func,
		onBackToContext: PropTypes.func,
		onDownloadStarted: PropTypes.func
	}

	flyoutRef = React.createRef()

	get supportedTypes () {
		const {report} = this.props;

		return report && report.supportedTypes || [];
	}

	get downloadLink () {
		const {report} = this.props;

		return report && report.href;
	}


	downloadStarted = (type) => {
		const {onDownloadStarted} = this.props;

		if (onDownloadStarted) {
			onDownloadStarted(type);
		}

		if (this.flyoutRef.current) {
			this.flyoutRef.current.dismiss();
		}
	}



	onBack = () => {
		const {onBackToContext} = this.props;

		if (onBackToContext) {
			onBackToContext();
		}
	}


	onDismiss = () => {
		const {onDismiss} = this.props;

		if (onDismiss) {
			onDismiss();
		}
	}


	render () {
		return (
			<div className="report-viewer-header">
				{this.renderBack()}
				{this.renderTitle()}
				{this.renderDownload()}
				{this.renderDismiss()}
			</div>
		);
	}


	renderBack () {
		const {report, context} = this.props;

		//if we don't have a report and we have context that means we haven't drilled in
		//if we don't have context there's never a need to show back

		return (
			<div className="back-container">
				{report && context && (<i className="back icon-chevronup-25" onClick={this.onBack} />)}
			</div>
		);
	}


	renderTitle () {
		const {report, context} = this.props;

		return (
			<div className="title">
				{report && report.title}
				{!report && context && context.title}
			</div>
		);
	}


	renderDownload () {
		const {downloadLink, supportedTypes} = this;
		const content = (
			<div>
				<i className="icon-download" />
				<span>{t('download')}</span>
			</div>
		);

		if (!downloadLink) { return null; }

		if (supportedTypes.length === 1) {
			return (
				<a className="download" href={downloadLink} download onClick={() => this.downloadStarted(supportedTypes[0])}>
					{content}
				</a>
			);
		}

		const trigger = (
			<span className="download">
				{content}
			</span>
		);

		return (
			<Flyout.Triggered trigger={trigger} ref={this.flyoutRef}>
				<div className="nti-reports-view-header-download">
					{supportedTypes.map((type, index) => {
						return (
							<a
								key={index}
								href={`${downloadLink}?format=${encodeURIComponent(type)}`}
								onClick={() => this.downloadStarted(type)}
								download
							>
								{t(type)}
							</a>
						);
					})}
				</div>
			</Flyout.Triggered>
		);
	}


	renderDismiss () {
		return (<i className="icon-light-x dismiss" onClick={this.onDismiss}/>);
	}
}
