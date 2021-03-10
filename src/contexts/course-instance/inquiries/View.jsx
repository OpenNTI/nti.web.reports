import React from 'react';
import PropTypes from 'prop-types';

import { decorate } from '@nti/lib-commons';
import { Loading, EmptyState } from '@nti/web-commons';
import { scoped } from '@nti/lib-locale';

import ViewerRegistry from '../../ViewerRegistry';

import Store from './Store';
import Item from './Item';

const t = scoped('nti-web-report.contexts.course-instance.inquiries.View', {
	error: 'Unable to load inquiries.',
	empty: 'There are no inquiries.',
});

class CourseInquiries extends React.Component {
	static propTypes = {
		context: PropTypes.object,
		rel: PropTypes.string,
		onSelect: PropTypes.func,

		store: PropTypes.object,
		loading: PropTypes.bool,
		error: PropTypes.bool,
		items: PropTypes.array,
	};

	componentDidMount() {
		const { context, store } = this.props;

		store.load(context);
	}

	componentDidUpdate(prevProps) {
		const { context: newContext, store } = this.props;
		const { context: oldContext } = prevProps;

		if (newContext !== oldContext) {
			store.load(newContext);
		}
	}

	render() {
		const { loading, items, error } = this.props;

		return (
			<div>
				{loading && <Loading.Mask />}
				{!loading && error && (
					<span className="error">{t('error')}</span>
				)}
				{!loading && !error && this.renderItems(items)}
			</div>
		);
	}

	renderItems(items) {
		if (!items || !items.length) {
			return this.renderEmpty();
		}

		const { rel } = this.props;

		return (
			<ul>
				{items.map(item => {
					return (
						<li key={item.getID()}>
							<Item
								item={item}
								onSelect={this.selectItem}
								rel={rel}
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
}

export default decorate(CourseInquiries, [
	ViewerRegistry.register('course-inquiries'),
	Store.connect({
		loading: 'loading',
		items: 'items',
		error: 'error',
	}),
]);
