import React from 'react';
import PropTypes from 'prop-types';

export const ChevronLeftArrowSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8 1L1 8.01705L7.96598 15" stroke={props.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

ChevronLeftArrowSVG.defaultProps = {
  width: 9,
  height: 16,
  color: '#10181F',
};

ChevronLeftArrowSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
