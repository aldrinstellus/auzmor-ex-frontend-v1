import React from 'react';
import PropTypes from 'prop-types';

export const AnnouncementIcon = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 21 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M7.4375 2.50028H1.3125M6.5625 16.5003H1.3125M3.9375 9.50028H1.3125M8.155 10.6203H10.8587V16.9203C10.8587 17.8478 12.0137 18.2853 12.6262 17.5853L19.25 10.0603C19.8275 9.40403 19.3637 8.38028 18.4887 8.38028H15.785V2.08028C15.785 1.15278 14.63 0.715278 14.0175 1.41528L7.39375 8.94028C6.825 9.59653 7.28875 10.6203 8.155 10.6203Z" stroke={props.color} strokeWidth="1.26" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>

);

AnnouncementIcon.defaultProps = {
  width: 21,
  height: 19,
  color: '#111111',
};

AnnouncementIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
