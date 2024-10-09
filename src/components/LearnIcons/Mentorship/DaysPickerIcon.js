import PropTypes from 'prop-types';
import React from 'react';

export const DaysPickerIconSVG = ({
  width, height, color, ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <path
      d="M8.5 2V5"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 2V5"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M16.5 3.5C19.83 3.68 21.5 4.95 21.5 9.65V15.83C21.5 19.95 20.5 22.01 15.5 22.01H9.5C4.5 22.01 3.5 19.95 3.5 15.83V9.65C3.5 4.95 5.17 3.69 8.5 3.5H16.5Z"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21.25 17.5996H3.75"
      stroke={color}
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.5 8.25C11.27 8.25 10.23 8.92 10.23 10.22C10.23 10.84 10.52 11.31 10.96 11.61C10.35 11.97 10 12.55 10 13.23C10 14.47 10.95 15.24 12.5 15.24C14.04 15.24 15 14.47 15 13.23C15 12.55 14.65 11.96 14.03 11.61C14.48 11.3 14.76 10.84 14.76 10.22C14.76 8.92 13.73 8.25 12.5 8.25ZM12.5 11.09C11.98 11.09 11.6 10.78 11.6 10.29C11.6 9.79 11.98 9.5 12.5 9.5C13.02 9.5 13.4 9.79 13.4 10.29C13.4 10.78 13.02 11.09 12.5 11.09ZM12.5 14C11.84 14 11.36 13.67 11.36 13.07C11.36 12.47 11.84 12.15 12.5 12.15C13.16 12.15 13.64 12.48 13.64 13.07C13.64 13.67 13.16 14 12.5 14Z"
      fill={color}
    />
  </svg>
);

DaysPickerIconSVG.defaultProps = {
  width: 24,
  height: 24,
  color: 'A3A3A3',
};

DaysPickerIconSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
