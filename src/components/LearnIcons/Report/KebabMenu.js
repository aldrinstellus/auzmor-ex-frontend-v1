import React from 'react';
import PropTypes from 'prop-types';

export const KebabMenuSVG = props => (
  <svg width={props.width} height={props.height} {...props}>
    <g transform="rotate(90 2.5 2.5)" fill="#969696" fillRule="nonzero">
      <circle cx={2.5} cy={2.5} r={2.5} />
      <circle cx={11.5} cy={2.5} r={2.5} />
      <circle cx={20.5} cy={2.5} r={2.5} />
    </g>
  </svg>
);

KebabMenuSVG.defaultProps = {
  width: 5,
  height: 23,
};

KebabMenuSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
