import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Loading, EmptyState} from '@nti/web-commons';

import ViewerRegistry from '../../ViewerRegistry';

import Store from './Store';
import DiscussionList from './DiscussionList';
import TopicList from './topic-list';

const t = scoped('web-reports.context.course-instance.forums.View', {
	empty: 'There are no forums',
	error: 'Unable to load forums',

	Open: 'Open Discussions',
	Other: 'Other Discussions',
	Section: 'My Section',
	Parent: 'All Sections'

});

@ViewerRegistry.register('course-forums')
@Store.connect({loading: 'loading', discussions: 'discussions', error: 'error'})
export default class CourseForums extends React.Component {
	static propTypes = {
		context: PropTypes.object,
		rel: PropTypes.string,
		onSelect: PropTypes.func,

		store: PropTypes.object,
		loading: PropTypes.bool,
		error: PropTypes.bool,
		discussions: PropTypes.object
	}

	state = {}

	get isTopicReport () {
		const {rel} = this.props;

		return rel === 'report-TopicParticipationReport.pdf';
	}


	componentDidMount () {
		const {context, store} = this.props;

		store.load(context);
	}


	componentDidUpdate (prevProps) {
		const {context:newContext, store} = this.props;
		const {context:oldContext} = prevProps;

		if (newContext !== oldContext) {
			store.load(newContext);
		}
	}


	onSelect = (forum) => {
		const {onSelect} = this.props;

		if (this.isTopicReport) {
			this.setState({
				selectedForum: forum
			});
		} else if (onSelect) {
			onSelect(forum);
		}
	}


	onTopicSelect = (topic) => {}


	render () {
		const {loading, discussions, error} = this.props;
		const {selectedForum} = this.state;

		return (
			<div className="course-instance-forums-report-context">
				{loading && (<Loading.Mask />)}
				{!loading && error && (<span className="error">{t('error')}</span>)}
				{!loading && !error && !selectedForum && (this.renderDiscussions(discussions))}
				{!loading && !error && selectedForum && (this.renderForum(selectedForum))}
			</div>
		);
	}


	renderDiscussions (discussions) {
		const {rel} = this.props;

		return (
			<DiscussionList rel={rel} discussions={discussions} isTopicReport={this.isTopicReport} onSelect={this.onSelect} />
		);
	}


	renderForum (forum) {
		const {rel} = this.props;

		return (
			<TopicList rel={rel} forum={forum} onSelect={this.onTopicSelect} />
		);
	}


	renderEmpty () {
		return (
			<EmptyState header={t('empty')} />
		);
	}
}
