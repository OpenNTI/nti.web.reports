import React from 'react';
import PropTypes from 'prop-types';
import { endOfDay, startOfDay } from 'date-fns';

import { scoped } from '@nti/lib-locale';
import { Text } from '@nti/web-commons';

import DateSelect from './DateSelect';

const t = scoped('web-reports.viewer.report.parameters', {
	labels: {
		'completionNotBefore': 'Completed After',
		'completionNotAfter': 'Completed Before'
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

const today =  new Date();
const lastWeek = (new Date(today)).setDate(today.getDate() - 7);
const lastMonth = (new Date(today)).setMonth(today.getMonth() - 1);
const lastQuarter = (new Date(today)).setMonth(today.getMonth() - 3);
const lastYear = (new Date(today)).setFullYear(today.getFullYear() - 1);

const DatePresets = [
	{value: today, label: t('dates.today')},
	{value: lastWeek, label: t('dates.lastWeek')},
	{value: lastMonth, label: t('dates.lastMonth')},
	{value: lastQuarter, label: t('dates.lastQuarter')},
	{value: lastYear, label: t('dates.lastYear')}
];

const Configs = {
	'completionNotBefore': {
		Cmp: DateSelect,
		defaultValue: startOfDay(lastWeek),
		presets: DatePresets.map(x => ({...x, value: startOfDay(x.value)}))
	},
	'completionNotAfter': {
		Cmp: DateSelect,
		defaultValue: endOfDay(today),
		presets: DatePresets.map(x => ({...x, value: endOfDay(x.value)}))
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

