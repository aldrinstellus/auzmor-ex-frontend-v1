import React from 'react';
import PropTypes from 'prop-types';

export const TrainingNewSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.3333 12.95V2.89168C17.3333 1.89168 16.5166 1.15001 15.525 1.23335H15.475C13.725 1.38335 11.0666 2.27502 9.58329 3.20835L9.44163 3.30001C9.19996 3.45001 8.79996 3.45001 8.55829 3.30001L8.34996 3.17502C6.86663 2.25002 4.21663 1.36668 2.46663 1.22501C1.47496 1.14168 0.666626 1.89168 0.666626 2.88335V12.95C0.666626 13.75 1.31663 14.5 2.11663 14.6L2.35829 14.6333C4.16663 14.875 6.95829 15.7917 8.55829 16.6667L8.59163 16.6833C8.81663 16.8083 9.17496 16.8083 9.39163 16.6833C10.9916 15.8 13.7916 14.875 15.6083 14.6333L15.8833 14.6C16.6833 14.5 17.3333 13.75 17.3333 12.95Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.45837 6.07501H3.58337"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.08337 8.57501H3.58337"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

TrainingNewSVG.defaultProps = {
  width: 18,
  height: 18,
  color: '#737373',
};

TrainingNewSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
