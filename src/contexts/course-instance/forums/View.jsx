import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Loading, EmptyState} from '@nti/web-commons';

import ViewerRegistry from '../../ViewerRegistry';

import Store from './Store';
import ForumItem from './ForumItem';

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


	componentDidMount () {
		const {context, store} = this.props;

		store.load(context);
	}


	componentDidUpdate (prevProps) {
		const {context:newContext, store} = this.props;
		const {context:oldContext} = this.props;

		if (newContext !== oldContext) {
			store.load(newContext);
		}
	}


	onSelect = (forum) => {
		const {onSelect} = this.props;

		if (onSelect) {
			onSelect(forum);
		}
	}


	render () {
		const {loading, discussions, error} = this.props;

		return (
			<div className="course-instance-forums-report-context">
				{loading && (<Loading.Mask />)}
				{!loading && error && (<span className="error">{t('error')}</span>)}
				{!loading && !error && (this.renderDiscussions(discussions))}
			</div>
		);
	}


	renderDiscussions (discussions) {
		const groups = discussions ? Object.keys(discussions) : [];
		const isSimple = groups.length === 1 && groups[0] === 'Other';

		if (!groups.length) {
			return this.renderEmpty();
		}

		return (
			<ul className="groups">
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
		const {rel} = this.props;
		const {forums} = section;

		return (
			<React.Fragment>
				{!isSimple && (<div className="section-title">{t(title)}</div>)}
				<ul className="forums">
					{
						forums.map((forum, index) => {
							return (
								<li key={index}>
									<ForumItem forum={forum} rel={rel} onSelect={this.onSelect} />
								</li>
							);
						})
					}
				</ul>
			</React.Fragment>
		);
	}



	renderEmpty () {
		return (
			<EmptyState header={t('empty')} />
		);
	}
}
