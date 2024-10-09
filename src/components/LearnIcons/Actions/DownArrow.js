import React from 'react';
import PropTypes from 'prop-types';

export const DownArrowSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 9 6" fill="none" {...props}>
      <path d="M8 1L4.5 5L1 1" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

DownArrowSVG.defaultProps = {
  width: 9,
  height: 6,
  color: '#FF3366',
};

DownArrowSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
