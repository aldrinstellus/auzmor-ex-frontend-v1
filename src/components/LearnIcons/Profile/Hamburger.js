import React from 'react';
import PropTypes from 'prop-types';

export const HamburgerSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 18 14" {...props}>
    <path d="M1.51042 1.16667H16.8229" stroke={props.color} strokeWidth={2} strokeLinecap="round" />
    <path d="M1.51042 7.00004H16.8229" stroke={props.color} strokeWidth={2} strokeLinecap="round" />
    <path d="M1.51042 12.8333H16.8229" stroke={props.color} strokeWidth={2} strokeLinecap="round" />
  </svg>
);

HamburgerSVG.defaultProps = {
  width: 18,
  height: 14,
  color: 'black',
};

HamburgerSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
