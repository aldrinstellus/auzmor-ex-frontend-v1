import React from 'react';
import PropTypes from 'prop-types';

export const CaretUpSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 7 4" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.5 3.5L3.5 0.500001L6.5 3.5" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>

  </React.Fragment>
);

CaretUpSVG.defaultProps = {
  width: 7,
  height: 4,
  color: '#000',
};

CaretUpSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
