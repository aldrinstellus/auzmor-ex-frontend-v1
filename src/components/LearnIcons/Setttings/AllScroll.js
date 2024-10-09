import React from 'react';
import PropTypes from 'prop-types';

export const AllScrollSVG = props => (
  <svg
    width={props.width}
    height={props.height}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.3887 5.49969L12.8664 6.95502L11.4111 8.43279"
      stroke={props.color}
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.46642 6.98844L12.8661 6.95478"
      stroke={props.color}
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.61229 8.50024L1.13452 7.04491L2.58984 5.56714"
      stroke={props.color}
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.13439 7.04484L5.53404 7.01118"
      stroke={props.color}
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.56713 11.4108L7.0449 12.8661L8.50023 11.3883"
      stroke={props.color}
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.01172 8.46613L7.04538 12.8658"
      stroke={props.color}
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.43382 2.58912L6.95605 1.13379L5.50073 2.61156"
      stroke={props.color}
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.95605 1.13379L6.98972 5.53344"
      stroke={props.color}
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

AllScrollSVG.defaultProps = {
  width: 14,
  height: 14,
  color: '#FF3366',
};

AllScrollSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
