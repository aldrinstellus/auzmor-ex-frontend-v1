import PropTypes from 'prop-types';
import React from 'react';

export const ChevronRightArrowV2SVG = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} viewBox="0 0 24 24" fill="none">
    <path d="M13 17L18 12L13 7" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 17L11 12L6 7" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

ChevronRightArrowV2SVG.defaultProps = {
  width: 24,
  height: 24,
  color: '#0E9F6E',
};

ChevronRightArrowV2SVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
