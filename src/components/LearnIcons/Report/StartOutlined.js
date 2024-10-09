import PropTypes from 'prop-types';
import React from 'react';

export const StartSVG = props => (
  <svg
    width={props.width}
    height={props.height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.8083 10.0001C17.8083 14.3263 14.3012 17.8334 9.97493 17.8334C5.6487 17.8334 2.1416 14.3263 2.1416 10.0001C2.1416 5.67385 5.6487 2.16675 9.97493 2.16675C14.3012 2.16675 17.8083 5.67385 17.8083 10.0001Z"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.2142 9.6556L11.154 10.2L10.2142 10.7444L9.28345 11.2837V10.1917V9.11639L10.2142 9.6556Z"
      stroke={props.color}
      strokeWidth="4"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

StartSVG.defaultProps = {
  width: 20,
  height: 20,
  color: '#FFF',
};

StartSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
