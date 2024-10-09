import PropTypes from 'prop-types';
import React from 'react';

export const AddPlusV2SVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 12H19" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
  </svg>

);

AddPlusV2SVG.defaultProps = {
  width: 24,
  height: 24,
  color: 'black',
};

AddPlusV2SVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
