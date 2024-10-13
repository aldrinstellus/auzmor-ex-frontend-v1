import React from 'react';
import PropTypes from 'prop-types';

export const HeartNotificationIconSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="10.5" fill={props.color} />
      <path d="M13.8125 6C14.7115 6 15.5326 6.3663 16.1245 7.03146C16.6891 7.66599 17 8.51578 17 9.4243C17 10.4133 16.6102 11.3331 15.7732 12.319C15.0251 13.2002 13.9489 14.1085 12.7028 15.1602L12.6985 15.1638C12.2354 15.5547 11.7566 15.9588 11.2469 16.4005L11.2316 16.4138C11.1653 16.4713 11.0826 16.5 11 16.5C10.9174 16.5 10.8347 16.4713 10.7684 16.4138L10.7531 16.4005C10.2419 15.9575 9.76168 15.5522 9.29733 15.1603L9.29727 15.1602C8.05107 14.1085 6.97489 13.2002 6.22684 12.319C5.38984 11.3331 5 10.4133 5 9.4243C5 8.51578 5.31095 7.66599 5.87551 7.03148C6.4674 6.36633 7.28848 6 8.1875 6C9.45191 6 10.2524 6.74793 10.7013 7.37538C10.8178 7.5382 10.9168 7.70146 11 7.85509C11.0832 7.70146 11.1823 7.5382 11.2987 7.37538C11.7476 6.74793 12.5481 6 13.8125 6Z" fill={props.iconColor} />
    </svg>

  </React.Fragment>
);

HeartNotificationIconSVG.defaultProps = {
  width: 22,
  height: 22,
  color: 'black',
  iconColor: 'white',
};

HeartNotificationIconSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  iconColor: PropTypes.string,
};
