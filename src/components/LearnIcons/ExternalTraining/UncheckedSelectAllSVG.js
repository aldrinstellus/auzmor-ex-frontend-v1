import React from 'react';
import PropTypes from 'prop-types';

export const UncheckedSelectAllSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="1" width="13" height="13" rx="2" stroke={props.color} strokeWidth="2" strokeLinecap="square" />
    <rect x="6" y="6" width="13" height="13" rx="2" fill="white" stroke={props.color} strokeWidth="2" strokeLinecap="square" />
  </svg>

);

UncheckedSelectAllSVG.defaultProps = {
  width: 20,
  height: 20,
  color: '#D8D8D8',
};

UncheckedSelectAllSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
