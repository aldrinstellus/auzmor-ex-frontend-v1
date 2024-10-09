import React from 'react';
import PropTypes from 'prop-types';

export const UsageSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M9.10352 16.6062C11.0921 16.6062 12.9992 15.816 14.4053 14.4095C15.8115 13.003 16.6014 11.0953 16.6014 9.1062C16.6014 7.11708 15.8115 5.20943 14.4053 3.80291C12.9992 2.39638 11.0921 1.6062 9.10352 1.6062" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4.75473 15.2228C3.77979 14.5294 2.98486 13.6128 2.43632 12.5494C1.88778 11.4861 1.60156 10.3069 1.60156 9.11032C1.60156 7.91375 1.88778 6.73452 2.43632 5.67117C2.98486 4.60781 3.77979 3.69117 4.75473 2.9978" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

UsageSVG.defaultProps = {
  width: 29,
  height: 24,
  color: '#FF3366',
};

UsageSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
