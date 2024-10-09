import React from 'react';
import PropTypes from 'prop-types';

export const NoteSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="1" width="15" height="19" rx="1.5" stroke={props.color} />
    <path d="M4 6.5H12" stroke={props.color} strokeLinecap="round" />
    <path d="M4 10.5H12" stroke={props.color} strokeLinecap="round" />
    <path d="M4 14.5H8" stroke={props.color} strokeLinecap="round" />
  </svg>
);

NoteSVG.defaultProps = {
  width: 16,
  height: 21,
  color: '#5C5C5C',
};

NoteSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
