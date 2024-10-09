import PropTypes from 'prop-types';
import React from 'react';


export const CircleFilledSVG = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width={props.size} height={props.size} viewBox="0 0 8 8" fill="none">
    <circle cx="4" cy="4" r="4" fill="#31C48D" />
  </svg>
);

CircleFilledSVG.propTypes = {
  size: PropTypes.number,
};

CircleFilledSVG.defaultProps = {
  size: 8,
};
