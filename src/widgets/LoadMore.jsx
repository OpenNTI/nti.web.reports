import './LoadMore.scss';
import PropTypes from 'prop-types';

import { Loading } from '@nti/web-commons';

export default function LoadMore({ hasNextPage, loadingNextPage, onClick }) {
	return (
		<div className="text-center button-box">
			{loadingNextPage ? (
				<Loading.Whacky />
			) : hasNextPage ? (
				<div className="load-more-button" onClick={onClick}>
					Load More
				</div>
			) : null}
		</div>
	);
}

LoadMore.propTypes = {
	onClick: PropTypes.func,
	hasNextPage: PropTypes.bool,
	loadingNextPage: PropTypes.func,
};
