import React from 'react';
import PropTypes from 'prop-types';

export const TemplateSVG = props => (
  <svg
    width={props.width}
    height={props.height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.66663 1.33325H3.99996C3.64634 1.33325 3.3072 1.47373 3.05715 1.72378C2.8071 1.97382 2.66663 2.31296 2.66663 2.66659V13.3333C2.66663 13.6869 2.8071 14.026 3.05715 14.2761C3.3072 14.5261 3.64634 14.6666 3.99996 14.6666H12C12.3536 14.6666 12.6927 14.5261 12.9428 14.2761C13.1928 14.026 13.3333 13.6869 13.3333 13.3333V4.99992L9.66663 1.33325Z"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.33337 1.33325V5.33325H13.3334"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.6667 8.66675H5.33337"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.6667 11.3333H5.33337"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.66671 6H5.33337"
      stroke="black"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

TemplateSVG.defaultProps = {
  width: 16,
  height: 16,
  color: '#171717',
};

TemplateSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
