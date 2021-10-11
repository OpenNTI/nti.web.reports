import './Statistics.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';
import { Loading } from '@nti/web-commons';
import { CircularProgress } from '@nti/web-charts';

const LABELS = {
	totalEnrolled: 'Total Enrolled',
	studentsCompleted: 'Students Completed',
	studentsWithProgress: 'Students With Progress',
};

const t = scoped('web-component-reports.widgets.statistics', LABELS);

export default class Statistics extends React.Component {
	static propTypes = {
		entity: PropTypes.object,
	};

	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			pageNumber: 0,
		};
	}

	componentDidMount() {
		this.loadData();
	}

	async loadData(link) {
		const { entity } = this.props;

		let progressStats = null;

		if (entity.hasLink('ProgressStats')) {
			progressStats = await entity.fetchLink({
				mode: 'raw',
				rel: 'ProgressStats',
			});
		}

		this.setState({
			loading: false,
			enrollmentCount: entity.enrolledTotalCount || 0,
			progressStats,
		});
	}

	renderValueSection(label, value) {
		return (
			<div className="labeled-value">
				<div className="label">{label}</div>
				<div className="value">{value}</div>
			</div>
		);
	}

	renderProgress() {
		const progress = this.state.progressStats.PercentageProgress || 0;

		return (
			<div className="progress">
				<CircularProgress
					value={Math.floor(progress * 100)}
					width={100}
					height={100}
					showPercentSymbol={true}
				/>
			</div>
		);
	}

	renderContent() {
		const { enrollmentCount, progressStats } = this.state;

		return (
			<div className="statistics-content">
				{progressStats && this.renderProgress()}
				{this.renderValueSection(t('totalEnrolled'), enrollmentCount)}
				{progressStats &&
					this.renderValueSection(
						t('studentsCompleted'),
						progressStats.CountCompleted
					)}
				{progressStats &&
					this.renderValueSection(
						t('studentsWithProgress'),
						progressStats.CountHasProgress
					)}
			</div>
		);
	}

	render() {
		const { loading } = this.state;

		return (
			<div className="dashboard-list-widget statistics">
				{loading ? <Loading.Ellipsis /> : this.renderContent()}
			</div>
		);
	}
}
