import PropTypes from 'prop-types';
import { isSameDay } from 'date-fns';

import { Icons, Flyout, DateTime, Radio } from '@nti/web-commons';
import { Button } from "@nti/web-core";

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

const getSelectedDate = (value, presets) => {
	if (!value) { return new Date(); }
	if (typeof value === 'number') { return new Date(value); } //convert to milliseconds

	for (let preset of presets) {
		if (preset.name === value) {
			return preset.value;
		}
	}
}

DateSelect.propTypes = {
	value: PropTypes.number,//the date in seconds
	onChange: PropTypes.func,

	presets: PropTypes.arrayOf(
		PropTypes.shape({
			label: PropTypes.string,
			value: PropTypes.object
		})
	),

	disabledDays: PropTypes.any
};
export default function DateSelect ({value, onChange, presets, disabledDays}) {
	const date = getSelectedDate(value, presets);
	const selectTime = (newDate) => {
		for (let preset of presets) {
			if (isSameDay(newDate, preset.value)) {
				onChange(preset.name);
			} else {
				onChange(newDate.getTime());
			}
		}
	};

	const trigger = (
		<Trigger>
			<DateTime date={date} />
			<Icons.Chevron.Down />
		</Trigger>
	);

	return (
		<Flyout.Triggered trigger={trigger} arrow>
			<Menu>
				{(presets ?? []).map((preset, key) => (
					<Preset key={key} onClick={() => onChange(preset.name)}>
						<Radio checked={isSameDay(date, preset.value)} label={preset.label} />
					</Preset>
				))}
				<li>
					<DateTime.DayPicker
						selectedDays={date}
						month={date}
						onChange={selectTime}
						disabledDays={disabledDays}
					/>
				</li>
			</Menu>
		</Flyout.Triggered>
	);
}
