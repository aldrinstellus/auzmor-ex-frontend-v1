import React from 'react';
import PropTypes from 'prop-types';

export const CaretDownSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 9 6" fill="none" {...props}>
      <path d="M1 1L4.33333 5L7.66667 1" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

CaretDownSVG.defaultProps = {
  width: 9,
  height: 6,
  color: 'black',
};

CaretDownSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
