import PropTypes from 'prop-types';
import React from 'react';

export const CalendarDateSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 2V4.25" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 2V4.25" stroke="white" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.625 7.3175H15.375" stroke={color} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.75 6.875V13.25C15.75 15.5 14.625 17 12 17H6C3.375 17 2.25 15.5 2.25 13.25V6.875C2.25 4.625 3.375 3.125 6 3.125H12C14.625 3.125 15.75 4.625 15.75 6.875Z" stroke={color} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.7713 10.775H11.778" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.7713 13.025H11.778" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.99686 10.775H9.00359" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.99686 13.025H9.00359" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.22049 10.775H6.22723" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.22049 13.025H6.22723" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

CalendarDateSVG.defaultProps = {
  width: 18,
  height: 19,
  color: '#FF3366',
};

CalendarDateSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
