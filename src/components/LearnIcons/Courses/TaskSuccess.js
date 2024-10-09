import React from 'react';
import PropTypes from 'prop-types';

export const TaskSuccessSVG = props => (
  <React.Fragment>
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M42 22C42 33.0457 33.0457 42 22 42C10.9543 42 2 33.0457 2 22C2 10.9543 10.9543 2 22 2C33.0457 2 42 10.9543 42 22Z"
        stroke={props.color}
        strokeWidth="4"
      />
      <path
        d="M13 21.2941L20.1321 28L31 16"
        stroke="#14C855"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </React.Fragment>
);

TaskSuccessSVG.defaultProps = {
  width: 45,
  height: 45,
  color: 'rgb(20,200,85)',
};

TaskSuccessSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
