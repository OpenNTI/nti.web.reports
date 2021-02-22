import { Stores } from '@nti/lib-store';

/**
 * Takes two arrays of forums and bins then
 *
 *	1.) by for credit or open
 *	2.) by if they are for this section or the parent
 *
 * returns an object that looks like:
 *
 *	{
 *		ForCredit: {
 *			Section: {id: String, items: Array[Forum]},
 *			Parent: {id: String, items: Array[Forum]}
 *		},
 *		Open: {
 *			Section: {id: String, items: Array[Forum]},
 *			Parent: {id: String, items: Array[Forum]}
 *		},
 *		Other: ...(same as above)
 *	}
 *
 * @param  {Object} section Object of forums in this section
 * @param  {Object} parent  Object of forums in the parent if there are any
 * @returns {Object}        The binned forums
 */
const binDiscussions = (section, parent) => {
	let bins = {};

	function addTo(key, group) {
		let items = (group && group.Items) || [];
		for (let item of items) {
			let bin = item.getBin();
			if (!bins[bin]) {
				bins[bin] = {};
			}

			bin = bins[bin];
			if (!bin[key]) {
				bin[key] = { id: group.NTIID, forums: [] };
			}

			bin[key].forums.push(item);
		}
	}

	addTo('Section', section);
	addTo('Parent', parent);

	// Stub out empty case
	if (!section.Items || section.Items.length === 0) {
		bins.Other = {
			...bins.Other,
			Section: {
				id: section.NTIID,
			},
		};
	}

	return bins;
};

export default class CourseForumsStore extends Stores.SimpleStore {
	constructor() {
		super();

		this.set('discussions', null);
		this.set('loading', false);
		this.set('error', false);
	}

	async load(course) {
		if (course === this.get('course')) {
			return;
		}

		this.set('loading', true);
		this.set('error', false);
		this.set('discussions', null);
		this.set('course', course);
		this.emitChange('loading', 'error', 'discussions', 'course');

		try {
			const [sections, parent] = await course.getDiscussions();
			const binned = binDiscussions(sections, parent);

			this.set('discussions', binned);
			this.set('loading', false);
			this.emitChange('loading', 'discussions');
		} catch (e) {
			this.set('loading', false);
			this.set('error', true);
			this.emitChange('loading', 'error');
		}
	}
}
