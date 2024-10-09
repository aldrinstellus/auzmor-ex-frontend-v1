import React from 'react';
import PropTypes from 'prop-types';

export const StarSVG = props => (
  <svg
    width={props.width}
    height={props.height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.9573 0.129395L15.4757 7.25731L23.3437 8.40734L17.6505 13.9525L18.9941 21.7864L11.9573 18.0858L4.92043 21.7864L6.26404 13.9525L0.570801 8.40734L8.43885 7.25731L11.9573 0.129395Z"
      fill={props.color}
    />
  </svg>
);

StarSVG.defaultProps = {
  width: 24,
  height: 24,
  color: '#F5C800',
};

StarSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
