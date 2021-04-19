import React from 'react';
import PropTypes from 'prop-types';
import { isSameDay } from 'date-fns';

import {Button, Icons, Flyout, DateTime, Radio} from '@nti/web-commons';

const Trigger = styled(Button).attrs({plain: true})`
	font-size: 0.875rem;
	color: var(--secondary-grey);
`;

const Menu = styled('ul')`
	list-style: none;
	padding: 0;
	margin: 0;
	min-width: 250px;
`;

const Preset = styled('li')`
	padding: 0.5rem;
	border-bottom: 1px solid var(--border-grey-light);
`;

DateSelect.propTypes = {
	value: PropTypes.number,//the date in seconds
	onChange: PropTypes.func,

	defaultValue: PropTypes.number,
	presets: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.object
		})
	)
};
export default function DateSelect ({value, onChange, defaultValue, presets}) {
	const time = (value ?? 0) * 1000;//convert to milliseconds
	const selectTime = (t) => onChange(t.getTime() / 1000);//convert to seconds

	const date = time ? new Date(time) : defaultValue;

	React.useEffect(() => {
		if (!value) { onChange(value); }
	}, [value]);

	const trigger = (
		<Trigger>
			<DateTime date={date} />
			<Icons.Chevron.Down />
		</Trigger>
	);

	debugger;

	return (
		<Flyout.Triggered trigger={trigger} arrow>
			<Menu>
				{(presets ?? []).map((preset, key) => (
					<Preset key={key} onClick={() => selectTime(preset.value)}>
						<Radio checked={isSameDay(date, preset.value)} label={preset.label} />
					</Preset>
				))}
				<li>
					<DateTime.DayPicker
						value={date}
						onChange={selectTime}
					/>
				</li>
			</Menu>
		</Flyout.Triggered>
	);
}
