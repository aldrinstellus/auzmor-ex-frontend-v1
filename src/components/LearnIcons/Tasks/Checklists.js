

import PropTypes from 'prop-types';
import React from 'react';

export const ChecklistsSVG = ({ width, height, color }) => (
  <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.66663 4H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.66663 8H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.66663 12H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 3.99967L2.66667 4.66634L4 3.33301" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 7.99967L2.66667 8.66634L4 7.33301" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 11.9997L2.66667 12.6663L4 11.333" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>

);

ChecklistsSVG.defaultProps = {
  width: 16,
  height: 16,
  color: '#F97316',
};

ChecklistsSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
