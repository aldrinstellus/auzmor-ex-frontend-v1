import React from 'react';
import PropTypes from 'prop-types';

export const RecorderSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 22 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.53 18.4201H5.21C2.05 18.4201 1 16.3201 1 14.2101V5.79008C1 2.63008 2.05 1.58008 5.21 1.58008H11.53C14.69 1.58008 15.74 2.63008 15.74 5.79008V14.2101C15.74 17.3701 14.68 18.4201 11.53 18.4201Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5202 15.0999L15.7402 13.1499V6.83989L18.5202 4.88989C19.8802 3.93989 21.0002 4.51989 21.0002 6.18989V13.8099C21.0002 15.4799 19.8802 16.0599 18.5202 15.0999Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5 9C11.3284 9 12 8.32843 12 7.5C12 6.67157 11.3284 6 10.5 6C9.67157 6 9 6.67157 9 7.5C9 8.32843 9.67157 9 10.5 9Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

RecorderSVG.defaultProps = {
  width: 22,
  height: 20,
  color: 'white',
};

RecorderSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
