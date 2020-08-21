import './TopicItem.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';

import {getReportFrom} from '../../../../utils';

const t = scoped('web-reports.context.course-instance.forums.topic-list.TopicItem', {
	postCount: {
		one: '%(count)s Comment',
		other: '%(count)s Comments'
	}
});

export default class CourseTopicItem extends React.Component {
	static propTypes = {
		topic: PropTypes.shape({
			title: PropTypes.string,
			PostCount: PropTypes.number
		}),
		rel: PropTypes.string,
		onSelect: PropTypes.func
	}


	onClick = () => {
		const {topic, onSelect} = this.props;

		if (onSelect) {
			onSelect(topic);
		}
	}


	render () {
		const {topic, rel} = this.props;
		const disabled = !getReportFrom(rel, topic);

		return (
			<div className={cx('report-course-instance-forums-topic-list-item', {disabled})} onClick={this.onClick}>
				<div className="title">{topic.title}</div>
				<div className="post-count">{t('postCount', {count: topic.PostCount})}</div>
			</div>
		);
	}
}
