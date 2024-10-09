import React from 'react';
import PropTypes from 'prop-types';

export const SubtasksSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.5 1C1.5 0.723858 1.27614 0.5 1 0.5C0.723858 0.5 0.5 0.723858 0.5 1H1.5ZM2.38462 5.61538V5.11538V5.61538ZM5.61538 12.1923H10.3333V11.1923H5.61538V12.1923ZM0.5 1V5.61538H1.5V1H0.5ZM0.5 5.61538V8H1.5V5.61538H0.5ZM5.61538 11.1923H4.69231V12.1923H5.61538V11.1923ZM10.3333 5.11539L2.38462 5.11538V6.11538L10.3333 6.11539V5.11539ZM2.38462 5.11538H1V6.11538H2.38462V5.11538ZM1.5 5.61538V4.23077H0.5V5.61538H1.5ZM4.69231 11.1923C2.92925 11.1923 1.5 9.76306 1.5 8H0.5C0.5 10.3153 2.37696 12.1923 4.69231 12.1923V11.1923Z"
      fill={color}
    />
    <path
      d="M11.5 4C12.3284 4 13 4.67157 13 5.5C13 6.32843 12.3284 7 11.5 7C10.6716 7 10 6.32843 10 5.5C10 4.67157 10.6716 4 11.5 4Z"
      stroke={color}
    />
    <path
      d="M11.5 10C12.3284 10 13 10.6716 13 11.5C13 12.3284 12.3284 13 11.5 13C10.6716 13 10 12.3284 10 11.5C10 10.6716 10.6716 10 11.5 10Z"
      stroke={color}
    />
  </svg>
);

SubtasksSVG.defaultProps = {
  width: 14,
  height: 14,
  color: '#5C5C5C',
};

SubtasksSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
