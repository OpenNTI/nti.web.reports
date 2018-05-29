import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

import {getReportFrom} from '../../../utils';

const t = scoped('web-reports.context.course-instance.forums.ForumItem', {
	topicCount: {
		one: '%(count)s Topic',
		other: '%(count)s Topics'
	}
});

export default class CourseForumItem extends React.Component {
	static propTypes = {
		forum: PropTypes.shape({
			title: PropTypes.string,
			TopicCount: PropTypes.number
		}).isRequired,
		rel: PropTypes.string,
		onSelect: PropTypes.func,
		isTopicReport: PropTypes.bool
	}

	onClick = () => {
		const {forum, onSelect} = this.props;

		if (onSelect) {
			onSelect(forum);
		}
	}


	render () {
		const {forum, rel, isTopicReport} = this.props;
		const disabled = !isTopicReport && !getReportFrom(rel, forum);

		return (
			<div className={cx('report-course-instance-forums-forum-item', {disabled})} onClick={this.onClick}>
				<div className="title">{forum.title}</div>
				<div className="topic-count">{t('topicCount', {count: forum.TopicCount})}</div>
			</div>
		);
	}
}
