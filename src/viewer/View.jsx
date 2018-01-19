import React from 'react';
import PropTypes from 'prop-types';
import {Prompt, Switch} from 'nti-web-commons';

import Context from './context';
import Report from './report';
import Header from './Header';
import Footer from './Footer';

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
			context: isContext ? report : null
		};
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
		const {report, context} = this.state;
		const active = report ?
			'report' :
			context ?
				'context' :
				'empty';

		return (
			<div className="report-viewer">
				<Header report={report} context={context} onDismiss={this.onDismiss} onBackToContext={this.onBackToContext}/>
				<Switch.Container className="report-body" active={active}>
					<Switch.Item name="report" component={Report} report={report} context={context} />
					<Switch.Item name="context" component={Context} report={report} context={context} selectReport={this.selectReport}/>
				</Switch.Container>
				<Footer onDismiss={this.onDismiss} />
			</div>
		);
	}
}
