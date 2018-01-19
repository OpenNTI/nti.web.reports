import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {Loading, EmptyState} from 'nti-web-commons';

import SearchBar from '../../../widgets/SearchBar';
import ViewerRegistry from '../../ViewerRegistry';
import LoadMore from '../../../widgets/LoadMore';

import Store from './Store';
import Item from './Item';

const DEFAULT_TEXT = {
	empty: 'There are not users'
};
const t = scoped('nti-web-reports.contexts.global.users.View', DEFAULT_TEXT);

@ViewerRegistry.register('user')
@Store.connect({loading: 'loading', items: 'items', loadNextPage: 'loadNextPage', hasNextPage: 'hasNextPage', loadingNextPage: 'loadingNextPage'})
export default class Courses extends React.Component {
	static propTypes = {
		context: PropTypes.object,
		rel: PropTypes.string,
		onSelect: PropTypes.object,

		store: PropTypes.object,
		loading: PropTypes.bool,
		items: PropTypes.array,
		loadNextPage: PropTypes.func,
		loadingNextPage: PropTypes.bool
	}

	state = {
		searchTerm: ''
	}

	componentDidMount () {
		const {store} = this.props;

		store.load();
	}


	componentWillReceiveProps (nextProps) {
		const {context: nextContext, store} = nextProps; // the store should never change
		const {context:oldContext} = this.props;

		if (nextContext !== oldContext) {
			store.load();
		}
	}


	selectItem = (item) => {
		const {onSelect} = this.props;

		if (onSelect) {
			onSelect(item);
		}
	}


	render () {
		const {loading, items} = this.props;

		return (
			<div className="course-instance-assignment-report-context">
				<div className="report-toolbar">
					<SearchBar onChange={this.onChange} searchTerm={this.state.searchTerm}/>
				</div>
				{loading && (<Loading.Mask />)}
				{!loading && (this.renderItems(items))}
			</div>
		);
	}


	onChange = (searchTerm) => {
		this.props.store.updateSearchTerm(searchTerm);

		this.setState({searchTerm});
	}


	nextPage = () => {
		this.props.store.loadNextPage();
	}


	renderItems (items) {
		if (!items || !items.length) {
			return this.renderEmpty();
		}

		const {rel, ...props} = this.props;

		return (
			<div>
				<ul>
					{
						items.map((item) => {
							return (
								<li key={item.getID()}>
									<Item item={item} onSelect={this.selectItem} rel={rel}/>
								</li>
							);
						})
					}
				</ul>
				{<LoadMore {...props} onClick={this.nextPage}/>}
			</div>
		);
	}


	renderEmpty () {
		return (
			<EmptyState header={t('empty')} />
		);
	}
}
