import React from 'react';
import PropTypes from 'prop-types';

export const GradCapSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 4.83325V9.03325M15 4.83325L8 1.33325L1 4.83325L8 8.33325L15 4.83325Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.7998 6.23334V9.73334C5.8998 11.8333 10.0998 11.8333 12.1998 9.73334V6.23334"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

GradCapSVG.defaultProps = {
  width: 16,
  height: 12,
  color: '#5C5C5C',
};

GradCapSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
