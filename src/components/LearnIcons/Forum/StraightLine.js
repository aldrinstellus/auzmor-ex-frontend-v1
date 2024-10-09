import React from 'react';
import PropTypes from 'prop-types';

export const StraightLineSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 1 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <line x1="0.5" y1="1" x2="0.499999" y2="16" stroke={props.color} strokeLinecap="round" />
  </svg>
);

StraightLineSVG.defaultProps = {
  width: 1,
  height: 17,
  color: 'white',
};

StraightLineSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
