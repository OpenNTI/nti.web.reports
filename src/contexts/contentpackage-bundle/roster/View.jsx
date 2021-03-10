import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';
import { Loading, EmptyState } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import ViewerRegistry from '../../ViewerRegistry';

import Store from './Store';
import Item from './Item';

const t = scoped('web-reports.context.contentpackage-bundle-roster.View', {
	empty: 'There are no learners in this book',
	error: 'Unable to load learners for this book',
	loadMore: 'Load More',
});
class BundleRoster extends React.Component {
	static deriveBindingFromProps(props) {
		return props.context;
	}

	static propTypes = {
		context: PropTypes.object,
		rel: PropTypes.string,
		onSelect: PropTypes.func,

		loading: PropTypes.bool,
		loaded: PropTypes.bool,
		error: PropTypes.bool,
		items: PropTypes.array,
		hasMore: PropTypes.bool,
		loadNextPage: PropTypes.func,
	};

	selectUserBundleRecord = record => {
		const { onSelect } = this.props;

		if (onSelect) {
			onSelect(record);
		}
	};

	onLoadMoreClick = () => {
		const { loadNextPage } = this.props;

		if (loadNextPage) {
			loadNextPage();
		}
	};

	render() {
		const { loading, loaded, items, error, hasMore } = this.props;
		const isLoading = !loaded || loading;
		const hasItems = items && items.length > 0;

		return (
			<div className="contentpackage-bundle-roster-context">
				{isLoading && !hasItems && <Loading.Mask />}
				{(!isLoading || hasItems) &&
					(hasItems || !error) &&
					this.renderItems()}
				{!loading && error && this.renderError()}
				{hasMore && this.renderLoadMore()}
			</div>
		);
	}

	renderItems() {
		const { items, rel } = this.props;

		if (!items || !items.length) {
			return this.renderEmpty();
		}

		return (
			<ul>
				{items.map((item, key) => {
					return (
						<li key={key}>
							<Item
								userBundleRecord={item}
								rel={rel}
								onSelect={this.selectUserBundleRecord}
							/>
						</li>
					);
				})}
			</ul>
		);
	}

	renderError() {
		return <span className="error">{t('error')}</span>;
	}

	renderEmpty() {
		return <EmptyState header={t('empty')} />;
	}

	renderLoadMore() {
		const { loading } = this.props;

		return (
			<div className="load-more" onClick={this.onLoadMoreClick}>
				{loading && <Loading.Spinner />}
				{!loading && <span>{t('loadMore')}</span>}
			</div>
		);
	}
}

export default decorate(BundleRoster, [
	ViewerRegistry.register('contentpackage-bundle-roster'),
	Store.connect([
		'items',
		'loading',
		'loaded',
		'hasMore',
		'loadNextPage',
		'error',
	]),
]);
