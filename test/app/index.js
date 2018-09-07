import React from 'react';
import ReactDOM from 'react-dom';
import {decodeFromURI} from '@nti/lib-ntiids';
import {getService} from '@nti/web-client';

import {List} from '../../src';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

let contextID = localStorage.getItem('report-context');

if (!contextID) {
	contextID = decodeFromURI(window.prompt('Enter the Report Context'));
	localStorage.setItem('report-context', contextID);
}

class Test extends React.Component {
	state = {}

	async componentDidMount () {
		const service = await getService();
		const context = await service.getObject(contextID);

		this.setState({
			context
		});
	}


	render () {
		const {context} = this.state;

		if (!context) { return null; }

		return (
			<List context={context} />
		);
	}
}

ReactDOM.render(
	React.createElement(Test, {}),
	document.getElementById('content')
);
