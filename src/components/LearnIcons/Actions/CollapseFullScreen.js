import React from 'react';
import PropTypes from 'prop-types';

export function CollapseFullScreenSVG(props) {
  return (
    <svg width={props.width} height={props.height} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M4.18648 20.3882L9.33234 15.2423" stroke={props.color} strokeWidth={2} strokeLinecap="round" />
      <path d="M10.4134 20.3239V14.0725H4.16198" stroke={props.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.3877 4.18553L15.2419 9.33139" stroke={props.color} strokeWidth={2} strokeLinecap="round" />
      <path d="M14.1609 4.24979V10.5012H20.4122" stroke={props.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

CollapseFullScreenSVG.defaultProps = {
  width: 25,
  height: 25,
  color: '#FF3366',
};

CollapseFullScreenSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
