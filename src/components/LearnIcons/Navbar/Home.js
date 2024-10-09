import React from 'react';
import PropTypes from 'prop-types';

export const HomeNewSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 14V11.5"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.39172 1.34998L1.61672 5.97498C0.966725 6.49164 0.550058 7.58331 0.691725 8.39998L1.80006 15.0333C2.00006 16.2166 3.13339 17.175 4.33339 17.175H13.6667C14.8584 17.175 16.0001 16.2083 16.2001 15.0333L17.3084 8.39998C17.4417 7.58331 17.0251 6.49164 16.3834 5.97498L10.6084 1.35831C9.71672 0.641643 8.27506 0.641643 7.39172 1.34998Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

HomeNewSVG.defaultProps = {
  width: 18,
  height: 18,
  color: '#737373',
};

HomeNewSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
