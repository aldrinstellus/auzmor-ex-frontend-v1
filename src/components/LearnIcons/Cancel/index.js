import React from 'react';
import PropTypes from 'prop-types';

export const CancelSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M1 1L14.7198 14.7198" stroke={props.color} strokeWidth={props.strokeWidth} />
      <path d="M15 1L1.28017 14.7198" stroke={props.color} strokeWidth={props.strokeWidth} />
    </svg>
  </React.Fragment>
);

CancelSVG.defaultProps = {
  width: 16,
  height: 16,
  strokeWidth: 2,
  color: 'black',
};

CancelSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  strokeWidth: PropTypes.number,
};
