import React from 'react';
import PropTypes from 'prop-types';

export const PartialSelectSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M1 4.5H13" stroke={props.color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  </React.Fragment>
);

PartialSelectSVG.defaultProps = {
  width: 14,
  height: 9,
  color: 'white',
};

PartialSelectSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
