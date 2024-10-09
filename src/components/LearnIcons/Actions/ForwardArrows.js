import React from 'react';
import PropTypes from 'prop-types';

export const ForwardArrowsSVG = props => (
  <svg
    width={props.width}
    height={props.height}
    viewBox="0 0 17 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.1665 11.3337L12.4998 8.00033L9.1665 4.66699"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.5 11.3337L7.83333 8.00033L4.5 4.66699"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

ForwardArrowsSVG.defaultProps = {
  width: 17,
  height: 16,
  color: '#737373',
};

ForwardArrowsSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
