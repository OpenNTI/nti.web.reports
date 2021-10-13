import './LabeledValue.scss';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Card from './Card';

AdminLabeledValue.propTypes = {
	className: PropTypes.string,
	label: PropTypes.node,
	children: PropTypes.node,
};
export default function AdminLabeledValue({
	className,
	label,
	children,
	...otherProps
}) {
	return (
		<Card className={cx('admin-labeled-value', className)} {...otherProps}>
			<div className="label">{label}</div>
			<div className="value">{children}</div>
		</Card>
	);
}
