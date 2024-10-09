import React from 'react';
import PropTypes from 'prop-types';

export const SupportNewSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.1667 14.3584H9.83335L6.12501 16.825C5.57501 17.1917 4.83335 16.8001 4.83335 16.1334V14.3584C2.33335 14.3584 0.666687 12.6917 0.666687 10.1917V5.19169C0.666687 2.69169 2.33335 1.02502 4.83335 1.02502H13.1667C15.6667 1.02502 17.3334 2.69169 17.3334 5.19169V10.1917C17.3334 12.6917 15.6667 14.3584 13.1667 14.3584Z"
      stroke={color}
      strokeWidth="1.2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.00001 8.46668V8.29171C9.00001 7.72504 9.35003 7.42503 9.70003 7.18336C10.0417 6.95003 10.3833 6.65004 10.3833 6.10004C10.3833 5.33337 9.76668 4.71667 9.00001 4.71667C8.23334 4.71667 7.6167 5.33337 7.6167 6.10004"
      stroke={color}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

SupportNewSVG.defaultProps = {
  width: 18,
  height: 18,
  color: '#737373',
};

SupportNewSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
