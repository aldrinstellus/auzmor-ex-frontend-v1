import React from 'react';
import PropTypes from 'prop-types';

export const BackArrowSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 15 15" fill="none" {...props}>
      <path d="M14 7.5H3.5" stroke={props.color} strokeWidth={2} strokeLinecap="round" />
      <path d="M7.57907 1.21094L1.20117 7.58884L7.57907 13.9667" stroke={props.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

BackArrowSVG.defaultProps = {
  width: 15,
  height: 15,
  color: 'black',
};

BackArrowSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
