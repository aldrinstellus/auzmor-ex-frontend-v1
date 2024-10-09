import React from 'react';
import PropTypes from 'prop-types';

export const CompressSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x={-2} width={17} height={14} fill="#D0D0D0" />
  </svg>
);
CompressSVG.defaultProps = {
  width: 256,
  height: 199,

};

CompressSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
