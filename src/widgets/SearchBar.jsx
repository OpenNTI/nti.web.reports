import React from 'react';
import PropTypes from 'prop-types';
import {Input} from 'nti-web-commons';

SearchBar.propTypes = {
	onChange: PropTypes.func.isRequired,
	searchTerm: PropTypes.string,
	className: PropTypes.string
};
export default function SearchBar ({className, searchTerm, onChange}) {
	return (
		<div className={className}>
			<Input.Text className="report-search-bar" placeholder="Search" value={searchTerm} onChange={onChange}/>
		</div>
	);
}
