import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import {decorate} from '@nti/lib-commons';
import {Loading, EmptyState} from '@nti/web-commons';
import {scoped} from '@nti/lib-locale';

import ViewerRegistry from '../../ViewerRegistry';

import Store from './Store';
import Item from './Item';

const DEFAULT_TEXT = {
	error: 'Unable to load transcript',
	empty: 'No transcripts available'

};
const t = scoped('web-reports.contexts.user.transcripts.View', DEFAULT_TEXT);

class UserTranscripts extends React.Component {
	static propTypes = {
		context: PropTypes.object,
		onSelect: PropTypes.func,

		store: PropTypes.object,
		items: PropTypes.array,
		loading: PropTypes.bool,
		error: PropTypes.bool
	}


	componentDidMount () {
		const {context, store} = this.props;

		store.loadTranscript(context);
	}


	componentDidUpdate (oldProps) {
		const {context:newContext, store} = this.props;
		const {context:oldContext} = oldProps;

		if (newContext !== oldContext) {
			store.loadTranscript(newContext);
		}
	}


	onSelect = (item) => {
		const {onSelect} = this.props;

		if (onSelect) {
			onSelect(item);
		}
	}


	render () {
		const {loading, items, error} = this.props;

		return (
			<div className="user-transcript-report-context">
				{loading && (<Loading.Mask />)}
				{!loading && this.renderItems(items)}
				{!loading && error && this.renderError(error)}
			</div>
		);
	}


	renderItems (items) {
		if (!items || !items.length) {
			return this.renderEmpty();
		}

		return (
			<ul>
				{items.map((item) => {
					return (
						<li key={item.getID()}>
							<Item item={item} onSelect={this.onSelect} />
						</li>
					);
				})}
			</ul>
		);
	}

	renderError () {
		return (
			<div className="error">
				{t('error')}
			</div>
		);
	}

	renderEmpty () {
		return (
			<EmptyState subHeader={t('empty')} />
		);
	}
}

export default decorate(UserTranscripts, [
	ViewerRegistry.register('user-transcripts'),
	Store.connect({items: 'items', loading: 'loading', error: 'error'}),
]);
