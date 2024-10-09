import PropTypes from 'prop-types';
import React from 'react';

export const RejectedSVG = props => (
  <React.Fragment>
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="10.5"
        cy="10.5"
        r="9.5"
        fill="#FF0000"
        stroke={props.color}
        strokeWidth="1.25"
      />
      <path
        d="M13.5 7.5L7.5 13.5"
        stroke={props.color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 7.5L13.5 13.5"
        stroke={props.color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </React.Fragment>
);

RejectedSVG.defaultProps = {
  width: 21,
  height: 21,
  color: 'white',
};

RejectedSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
