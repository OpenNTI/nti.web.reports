import './Item.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Avatar, DisplayName} from '@nti/web-commons';

import {getReport} from '../../../utils';

export default class ContentPackageBundleRosterItem extends React.Component {
	static propTypes = {
		userBundleRecord: PropTypes.shape({
			User: PropTypes.object
		}).isRequired,
		rel: PropTypes.string,
		onSelect: PropTypes.func
	}


	onClick = () => {
		const {userBundleRecord, onSelect} = this.props;

		if (onSelect) {
			onSelect(userBundleRecord);
		}
	}

	render () {
		const {userBundleRecord, rel} = this.props;
		const disabled = !getReport(rel, userBundleRecord);
		const {User} = userBundleRecord;

		return (
			<div className={cx('report-contentpackage-bundle-roster-item', {disabled})} onClick={this.onClick}>
				<Avatar entity={User} />
				<div className="info">
					<DisplayName entity={User} />
				</div>
			</div>
		);
	}
}
