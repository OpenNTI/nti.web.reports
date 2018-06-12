import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {SelectBox, Loading, Prompt, Panels} from '@nti/web-commons';
import cx from 'classnames';

import OutlineChartRow, {LARGE, MEDIUM, SMALL} from './OutlineChartRow';

export const ACTIVITY = 'activity';
export const NUMBER_OF_VIEWS = 'viewCount';
export const TIME_VIEWED = 'viewTime';

export default class OutlineChart extends React.Component {
	static propTypes = {
		contentPackage: PropTypes.object.isRequired,
		statType: PropTypes.oneOf([ACTIVITY, NUMBER_OF_VIEWS, TIME_VIEWED]),
		onDismiss: PropTypes.func
	}

	state = {}

	static show (contentPackage, statType) {
		Prompt.modal(<OutlineChart contentPackage={contentPackage} statType={statType}/>, 'outline-chart-dialog');
	}

	async componentDidMount () {
		const {contentPackage} = this.props;

		const toc = await contentPackage.getTablesOfContents();

		const items = this.getItems(toc);

		let depthMap = {};

		// create a mapping of depths to type names
		items.filter(x => x.title && x.level).forEach(v => {
			depthMap[v.level] = v.type;
		});

		// convert map to array of {level, type}
		const depthArray = Object.keys(depthMap).map(v => {
			return {level: v, type: depthMap[v]};
		});

		// make sure we're sorted by actual depth
		depthArray.sort((a, b) => {
			return a.level - b.level;
		});

		this.setState({items, levels: depthArray, selectedLevel: depthArray[0].level, selectedStatType: this.props.statType || TIME_VIEWED});
	}

	reducer (value, depth) {
		if(value.children) {
			return value.children.reduce((acc, v) => {
				return acc.concat(this.reducer(v, depth + 1));
			}, [value]);
		}

		return [value];
	}

	getItems (toc) {
		const tocRoots = toc.map(x => x);

		const flattened = tocRoots.reduce((acc, v) => {
			return acc.concat(this.reducer(v, 0));
		}, []);

		return flattened;
	}

	renderRow = (row) => {
		const size = row.level <= 1 ? LARGE : row.level === 2 ?  MEDIUM : SMALL;

		return <OutlineChartRow key={row.id} text={row.title} percent={this.fakePercentage(row.title)} size={size}/>;
	}

	fakePercentage (title) {
		let agg = 0;

		for(let i = 0; i < title.length; i++) {
			agg += 0 + title.charCodeAt(i) * 10;
			agg = agg % 100;
		}

		for(let i = 0; i < this.state.selectedStatType.length; i++) {
			agg += 0 + this.state.selectedStatType.charCodeAt(i) * 10;
			agg = agg % 100;
		}

		for(let i = 0; i < this.state.selectedLevel.length; i++) {
			agg += 0 + this.state.selectedLevel.charCodeAt(i) * 10;
			agg = agg % 100;
		}

		return agg;
	}


	onLevelChange = (val) => {
		this.setState({selectedLevel: val});
	}


	onStatTypeChange = (val) => {
		this.setState({selectedStatType: val});
	}

	renderStatTypeControl () {
		const options = [
			{ label: 'View Time', value: TIME_VIEWED },
			{ label: 'View Count', value: NUMBER_OF_VIEWS },
			{ label: 'Activity', value: ACTIVITY }
		];

		return (
			<div className="chart-control">
				<span className="control-label">Show</span>
				<SelectBox className="stat-type-select" options={options} onChange={this.onStatTypeChange} value={this.state.selectedStatType} />
			</div>
		);
	}


	renderDepthControl () {
		const options = this.state.levels.map(x => { return { label: x.type, value: x.level }; });

		return (
			<div className="chart-control">
				<span className="control-label">By</span>
				<SelectBox className="depth-select" options={options} onChange={this.onLevelChange} value={this.state.selectedLevel} />
			</div>
		);
	}

	onConfirm = () => {
		const {onDismiss} = this.props;

		if(onDismiss) {
			onDismiss();
		}
	}

	render () {
		const {selectedLevel, items} = this.state;

		if(!items) {
			return <Loading.Ellipsis/>;
		}

		return (
			<div className="outline-chart">
				<Panels.TitleBar title={items[0].title} iconAction={this.onConfirm} />
				<div className="chart-content">
					<div className="chart-controls">
						{this.renderStatTypeControl()}
						{this.renderDepthControl()}
					</div>
					<div className="outline-chart-rows">
						{items.filter(x => {
							// don't show items without a title or level
							if(!x.title || !x.level) {
								return false;
							}

							// don't show items beyond the selected level
							if(selectedLevel) {
								return x.level <= selectedLevel;
							}

							return true;
						}).map(this.renderRow)}
					</div>
				</div>
			</div>
		);
	}
}
