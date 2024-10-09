import React from 'react';
import PropTypes from 'prop-types';

export const CourseExpirationSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="2.79999" width="17" height="16.2" rx="2" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.2779 1V4.6" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.72222 1V4.6" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1 8.2H18" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

CourseExpirationSVG.defaultProps = {
  width: 20,
  height: 20,
  color: '#F36',
};

CourseExpirationSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
