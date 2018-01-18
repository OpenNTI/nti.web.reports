import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

AdminCard.propTypes = {
	className: PropTypes.string
};
export default function AdminCard ({className, ...otherProps}) {
	return (
		<div className={cx('admin-card', className)} {...otherProps} />
	);
}
