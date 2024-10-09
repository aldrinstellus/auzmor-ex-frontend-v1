import React from 'react';
import PropTypes from 'prop-types';

export const ChevronBackArrowSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 7 12" fill="none" {...props}>
      <path d="M6 1L1 6L6 11" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

ChevronBackArrowSVG.defaultProps = {
  width: 7,
  height: 12,
  color: '#303030',
};

ChevronBackArrowSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
