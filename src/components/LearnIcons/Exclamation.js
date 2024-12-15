import PropTypes from 'prop-types';
import React from 'react';

export const ExclamationSVG = (props) => (
  <React.Fragment>
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 12 12"
      fill="none"
      {...props}
    >
      <circle cx="6" cy="6" r="5.5" stroke={props.color} />
      <path
        d="M5.59422 3.304H6.40222L6.19422 7.504H5.79422L5.59422 3.304ZM6.41022 8.176V9H5.58622V8.176H6.41022Z"
        fill={props.color}
      />
    </svg>
  </React.Fragment>
);

ExclamationSVG.defaultProps = {
  width: 12,
  height: 12,
  color: '#636363',
};

ExclamationSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
