import React from 'react';
import PropTypes from 'prop-types';

export const BackwardArrowsSVG = props => (
  <svg
    width={props.width}
    height={props.height}
    viewBox="0 0 9 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3.83333 7.33366L0.5 4.00033L3.83333 0.666992"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.49984 7.33366L5.1665 4.00033L8.49984 0.666992"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

BackwardArrowsSVG.defaultProps = {
  width: 9,
  height: 8,
  color: '#E5E5E5',
};

BackwardArrowsSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
