import PropTypes from 'prop-types';
import React from 'react';

export const CheckOutlinedSVG = ({
  width, height, color, ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <g clipPath="url(#clip0_11905_209856)">
      <path
        d="M10.0013 18.3327C14.6038 18.3327 18.3346 14.6018 18.3346 9.99935C18.3346 5.39685 14.6038 1.66602 10.0013 1.66602C5.3988 1.66602 1.66797 5.39685 1.66797 9.99935C1.66797 14.6018 5.3988 18.3327 10.0013 18.3327Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 10.0007L9.16667 11.6673L12.5 8.33398"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_11905_209856">
        <rect width="20" height="20" fill={color} />
      </clipPath>
    </defs>
  </svg>
);

CheckOutlinedSVG.defaultProps = {
  width: 20,
  height: 20,
  color: '#FFFFFF',
};

CheckOutlinedSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
