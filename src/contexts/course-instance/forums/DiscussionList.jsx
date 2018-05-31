import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {EmptyState} from '@nti/web-commons';

import ForumItem from './ForumItem';

const t = scoped('web-reports.context.course-instance.forums.DiscussionList', {
	empty: 'There are no forums',
	error: 'Unable to load forums',

	Open: 'Open Discussions',
	Other: 'Other Discussions',
	ForCredit: 'Enrolled For-Credit',
	Section: 'My Section',
	Parent: 'All Sections'

});

export default class DiscussionList extends React.Component {
	static propTypes = {
		discussions: PropTypes.object,
		rel: PropTypes.string,
		onSelect: PropTypes.func,
		isTopicReport: PropTypes.bool
	}


	render () {
		const {discussions} = this.props;
		const groups = discussions ? Object.keys(discussions) : [];
		const isSimple = groups.length === 1 && groups[0] === 'Other';

		if (!groups.length) {
			return this.renderEmpty();
		}

		return (
			<ul className="discussion-list">
				{
					groups.map((group, index) => {
						return (
							<li key={index}>
								{this.renderGroup(group, discussions[group], isSimple)}
							</li>
						);
					})
				}
			</ul>
		);
	}


	renderEmpty () {
		return (
			<EmptyState header={t('empty')} />
		);
	}


	renderGroup (title, sections, isSimple) {
		const names = sections ? Object.keys(sections) : [];
		const isSimpleGroup = isSimple && names.length === 1 && names[0] === 'Section';

		if (!names.length) {
			return null;
		}

		return (
			<React.Fragment>
				{!isSimple && (<div className="group-title">{t(title)}</div>)}
				<ul className="sections">
					{
						names.map((name, index) => {
							return (
								<li key={index}>
									{this.renderSection(name, sections[name], isSimpleGroup)}
								</li>
							);
						})
					}
				</ul>
			</React.Fragment>
		);
	}


	renderSection (title, section, isSimple) {
		const {rel, onSelect, isTopicReport} = this.props;
		const {forums} = section;

		return (
			<React.Fragment>
				{!isSimple && (<div className="section-title">{t(title)}</div>)}
				<ul className="forums">
					{
						forums.map((forum, index) => {
							return (
								<li key={index}>
									<ForumItem forum={forum} rel={rel} onSelect={onSelect} isTopicReport={isTopicReport} />
								</li>
							);
						})
					}
				</ul>
			</React.Fragment>
		);
	}
}
