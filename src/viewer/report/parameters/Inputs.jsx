import React from 'react';
import PropTypes from 'prop-types';
import { endOfDay, startOfDay } from 'date-fns';

import { scoped } from '@nti/lib-locale';
import { Text } from '@nti/web-commons';

import DateSelect from './DateSelect';

const t = scoped('web-reports.viewer.report.parameters', {
	labels: {
		'completionNotBefore': 'Participation After',
		'completionNotAfter': 'Participation Before'
	},
	dates: {
		today: 'Today',
		lastWeek: 'Last Week',
		lastMonth: 'Last Month',
		lastQuarter: 'Last 3 Months',
		lastYear: 'Last Year'
	}
});

const Container = styled.div`
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	cursor: pointer;

	& > * + *{
		margin-left: 1rem;
	}
`;

const Wrapper = styled.div``;
const Label = styled(Text.Label)`
	display: block;
	color: var(--tertiary-grey);
`;

const today = new Date();

const Dates = {
	today,
	lastWeek: (new Date(today)).setDate(today.getDate() - 7),
	lastMonth: (new Date(today)).setMonth(today.getMonth() - 1),
	lastQuarter: (new Date(today)).setMonth(today.getMonth() - 3),
	lastYear: (new Date(today)).setFullYear(today.getFullYear() - 1)
};

const DatePresets = [
	{value: Dates.today, label: t('dates.today'), name: 'today'},
	{value: Dates.lastWeek, label: t('dates.lastWeek'), name: 'lastWeek'},
	{value: Dates.lastMonth, label: t('dates.lastMonth'), name: 'lastMonth'},
	{value: Dates.lastQuarter, label: t('dates.lastQuarter'), name: 'lastQuarter'},
	{value: Dates.lastYear, label: t('dates.lastYear'), name: 'lastYear'}
];

const Configs = {
	'completionNotBefore': {
		Cmp: DateSelect,
		defaultValue: 'lastWeek',
		presets: DatePresets.map(x => ({...x, value: startOfDay(x.value)})),
		disabledDays: {after: Dates.today},
		getParamValue: (value) => {
			if (typeof value !== 'string') { return value; }

			return startOfDay(Dates[value]).getTime() / 1000; //convert to seconds
		}
	},
	'completionNotAfter': {
		Cmp: DateSelect,
		defaultValue: 'today',
		presets: DatePresets.map(x => ({...x, value: endOfDay(x.value)})),
		disabledDays: {after: Dates.today},
		getParamValue: (value) => {
			if (typeof value !== 'string') { return value; }

			return endOfDay(Dates[value]).getTime() / 1000; //convert to seconds
		}
	}
};

const Inputs = Object.entries(Configs)
	.reduce((acc, [param, config]) => {
		const {Cmp, ...otherProps} = config;
		const label = t(`labels.${param}`);

		acc[param] = ({value, onChange, ...props}) => (
			<Wrapper {...props} >
				<Label>{label}</Label>
				<Cmp value={value} onChange={onChange} {...otherProps} />
			</Wrapper>
		);
		return acc;
	}, {});

ReportParameterInputs.getParamValues = (params = {}) => {
	const values = {};

	for (let [key, value] of Object.entries(params)) {
		const formatted = Configs[key]?.getParamValue?.(value) ?? value;

		values[key] = formatted;
	}

	return values;
};

ReportParameterInputs.defaultParams = Object.entries(Configs)
	.reduce((acc, [param, config]) => {
		if (!config.defaultValue) { return acc; }

		return {
			...acc,
			[param]: config.defaultValue
		};
	}, {});

ReportParameterInputs.propTypes = {
	report: PropTypes.shape({
		acceptedParameters: PropTypes.array
	}),

	params: PropTypes.object,
	onChange: PropTypes.func
};
export default function ReportParameterInputs ({report, params = {}, onChange}) {
	const {acceptedParameters} = report;

	if (!acceptedParameters || acceptedParameters.length === 0) { return null; }

	return (
		<Container>
			{acceptedParameters.map((name) => {
				const Input = Inputs[name];

				if (!Input) { throw new Error('Unknown Report Param'); }

				return (
					<Input
						key={name}
						value={params[name]}
						onChange={(newValue) => (
							onChange({...params, [name]: newValue})
						)}
					/>
				);
			})}
		</Container>
	);
}

