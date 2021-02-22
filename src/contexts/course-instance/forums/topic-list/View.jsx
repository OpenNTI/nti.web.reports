import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { decorate } from '@nti/lib-commons';
import { scoped } from '@nti/lib-locale';
import { Loading, EmptyState } from '@nti/web-commons';

import Store from './Store';
import TopicItem from './TopicItem';

const t = scoped('web-reports.context.course-instance.forum.topic-list.View', {
	empty: 'There are no topics',
	error: 'Unable to load topics',
	loadMore: 'Load More',
	back: 'Back to Forums',
});

class CourseTopicList extends React.Component {
	static propTypes = {
		forum: PropTypes.object,
		rel: PropTypes.string,
		onSelect: PropTypes.func,
		onBack: PropTypes.func,

		store: PropTypes.object,
		loading: PropTypes.bool,
		error: PropTypes.bool,
		hasMore: PropTypes.bool,
		items: PropTypes.array,
	};

	componentDidMount() {
		const { forum, store } = this.props;

		store.load(forum);
	}

	componentDidUpdate(prevProps) {
		const { forum: newForum, store } = this.props;
		const { forum: oldForum } = prevProps;

		if (oldForum !== newForum) {
			store.load(newForum);
		}
	}

	onLoadMoreClick = () => {
		const { loading, store } = this.props;

		if (!loading) {
			store.loadNextPage();
		}
	};

	onTopicSelect = topic => {
		const { onSelect } = this.props;

		if (onSelect) {
			onSelect(topic);
		}
	};

	onBack = () => {
		const { onBack } = this.props;

		if (onBack) {
			onBack();
		}
	};

	render() {
		const { loading, items, error, hasMore } = this.props;

		return (
			<div className="course-instance-forums-topic-list-context">
				<div className="back-to-forums" onClick={this.onBack}>
					<i className="icon-chevron-left" />
					<span>{t('back')}</span>
				</div>
				{loading && !items.length && <Loading.Mask />}
				{(!loading || items.length > 0) &&
					(items.length > 0 || !error) &&
					this.renderItems(items)}
				{!loading && error && (
					<span className="error">{t('error')}</span>
				)}
				{hasMore && this.renderHasMore()}
			</div>
		);
	}

	renderItems(items) {
		if (!items.length) {
			return this.renderEmpty();
		}

		const { rel } = this.props;

		return (
			<ul>
				{items.map((item, key) => {
					return (
						<li key={key}>
							<TopicItem
								topic={item}
								rel={rel}
								onSelect={this.onTopicSelect}
							/>
						</li>
					);
				})}
			</ul>
		);
	}

	renderEmpty() {
		return <EmptyState header={t('empty')} />;
	}

	renderHasMore() {
		const { loading } = this.props;

		return (
			<div className="load-more" onClick={this.onLoadMoreClick}>
				{loading && <Loading.Spinner />}
				{!loading && <span>{t('loadMore')}</span>}
			</div>
		);
	}
}

export default decorate(CourseTopicList, [
	Store.connect({
		loading: 'loading',
		items: 'items',
		error: 'error',
		hasMore: 'hasMore',
	}),
]);
