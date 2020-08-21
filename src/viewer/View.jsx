import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Prompt, Switch, Toast} from '@nti/web-commons';

import Context from './context';
import Report from './report';
import Header from './Header';
import Footer from './Footer';

const t = scoped('web-reports.viewer.View', {
	'application/pdf': 'PDF',
	'text/csv': 'CSV',
	downloading: {
		title: 'Generating %(type)s Report:',
		message: 'The report will begin downloading soon.'
	}
});

export default class ReportViewer extends React.Component {
	static show (report) {
		return new Promise(fulfill => {
			Prompt.modal(
				(<ReportViewer
					report={report}
					onDismiss={fulfill}
				/>),
				'report-viewer-container'
			);
		});
	}

	static propTypes = {
		report: PropTypes.object.isRequired,
		onDismiss: PropTypes.func
	}


	constructor (props) {
		super(props);

		this.state = this.getStateFor(props);
	}


	componentWillReceiveProps (nextProps) {
		const {report:newReport} = nextProps;
		const {report:oldReport} = this.props;

		if (newReport !== oldReport) {
			this.setState(this.getStateFor(nextProps));
		}
	}


	getStateFor (props = this.props) {
		const {report} = props;
		const isContext = !report.href;

		return {
			report: isContext ? null : report,
			context: isContext ? report : null,
			downloading: []
		};
	}

	onDownloadStarted = (type) => {
		const downloading = new Set(this.state.downloading);

		downloading.add(type);

		this.setState({
			downloading: Array.from(downloading)
		});
	}

	dismissDownloadMessage = (type) => {
		const downloading = new Set(this.state.downloading);

		downloading.delete(type);

		this.setState({
			downloading: Array.from(downloading)
		});
	}


	onDismiss = () => {
		const {onDismiss} = this.props;

		if (onDismiss) {
			onDismiss();
		}
	}


	selectReport = (report) => {
		this.setState({
			report
		});
	}

	onBackToContext = () => {
		this.setState({
			report: null
		});
	}


	render () {
		const {report, context, downloading} = this.state;
		const active = report ?
			'report' :
			context ?
				'context' :
				'empty';

		return (
			<div className="report-viewer">
				<Header
					report={report}
					context={context}
					onDismiss={this.onDismiss}
					onBackToContext={this.onBackToContext}
					onDownloadStarted={this.onDownloadStarted}
				/>
				<Toast.Container location={Toast.Locations.Top}>
					<Switch.Container className="report-body" active={active}>
						<Switch.Item name="report" component={Report} report={report} context={context} />
						<Switch.Item name="context" component={Context} report={report} context={context} selectReport={this.selectReport}/>
					</Switch.Container>
					{downloading.map(type => (
						<Toast.MessageBar
							key={type}
							title={t('downloading.title', {type: t(type)})}
							message={t('downloading.message')}
							onDismiss={() => this.dismissDownloadMessage(type)}
						/>
					))}
				</Toast.Container>
				<Footer onDismiss={this.onDismiss} />
			</div>
		);
	}
}
