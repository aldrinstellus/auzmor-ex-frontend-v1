import React from 'react';
import PropTypes from 'prop-types';

export const ForumCommentSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.2216 14.0111C16.0343 13.0023 16.5896 11.8111 16.8399 10.5401C17.0902 9.26911 17.0279 7.95632 16.6584 6.71471C16.2889 5.4731 15.6233 4.33987 14.7187 3.41254C13.8142 2.48521 12.6978 1.79155 11.4658 1.39126C10.2338 0.990984 8.92294 0.896058 7.64609 1.11466C6.36924 1.33327 5.16462 1.85887 4.13591 2.6462C3.1072 3.43354 2.28522 4.45905 1.74068 5.63447C1.19614 6.80989 0.945371 8.10001 1.00994 9.39383C1.16009 11.4774 2.10024 13.425 3.63831 14.8387C5.17637 16.2523 7.19623 17.0252 9.28508 16.9994H17.5302L15.4015 15.4503C15.2922 15.3698 15.2004 15.268 15.1318 15.1509C15.0631 15.0338 15.0191 14.904 15.0022 14.7694C14.9854 14.6347 14.9962 14.498 15.0339 14.3677C15.0716 14.2373 15.1355 14.116 15.2216 14.0111Z" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>

  </React.Fragment>
);

ForumCommentSVG.defaultProps = {
  width: 19,
  height: 18,
  color: 'black',
};

ForumCommentSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
