import PropTypes from 'prop-types';
import React from 'react';

export const QuestionsSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.6001 11.3842H12.9001" stroke={color} strokeLinecap="square" />
    <path d="M9.6001 13.0531H12.9001" stroke={color} strokeLinecap="square" />
    <rect x="5.0625" y="10.5127" width="3.3" height="3.3" rx="1.1" stroke={color} />
    <path d="M9.6001 6.43398H12.9001" stroke={color} strokeLinecap="square" />
    <path d="M9.6001 8.10293H12.9001" stroke={color} strokeLinecap="square" />
    <rect x="5.0625" y="5.5625" width="3.3" height="3.3" rx="1.1" stroke={color} />
    <path fillRule="evenodd" clipRule="evenodd" d="M3 4.9714C3 4.15877 3.65877 3.5 4.4714 3.5H13.175C14.39 3.5 15.375 4.48497 15.375 5.7V13.675C15.375 14.89 14.39 15.875 13.175 15.875H5.2C3.98497 15.875 3 14.89 3 13.675V4.9714V4.9714Z" stroke={color} />
  </svg>
);

QuestionsSVG.defaultProps = {
  width: 18,
  height: 19,
  color: '#FF3366',
};

QuestionsSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
