import PropTypes from 'prop-types';
import React from 'react';

export const PlusWithBgSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="10.5" r="9.5" fill="#12B44D" stroke={props.color} strokeWidth="1.25" />
      <path d="M7.46875 9.99219H14.542" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 13.5342V6.46094" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

PlusWithBgSVG.defaultProps = {
  width: 22,
  height: 21,
  color: 'white',
};

PlusWithBgSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
