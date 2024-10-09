import React from 'react';
import PropTypes from 'prop-types';

export const ChevronRightArrowSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M0.63916 0.709961L3.92928 4.00008L0.63916 7.2902" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

ChevronRightArrowSVG.defaultProps = {
  width: 5,
  height: 8,
  color: '#979797',
};

ChevronRightArrowSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
