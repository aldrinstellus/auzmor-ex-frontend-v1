import React from 'react';
import PropTypes from 'prop-types';

export const CategoryViewSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 14 15" fill="none" {...props}>
      <rect width="6.53061" height="6.53061" rx={2} fill={props.color} />
      <path d="M0 10C0 8.89543 0.895431 8 2 8H12C13.1046 8 14 8.89543 14 10V12.5306C14 13.6352 13.1046 14.5306 12 14.5306H2C0.89543 14.5306 0 13.6352 0 12.5306V10Z" fill={props.color} />
    </svg>
  </React.Fragment>
);

CategoryViewSVG.defaultProps = {
  width: 14,
  height: 15,
  color: '#D0D0D0',
};

CategoryViewSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
