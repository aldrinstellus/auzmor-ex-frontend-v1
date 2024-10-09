import PropTypes from 'prop-types';
import React from 'react';

export const CloseWithCircleSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="8.5" stroke={props.color} />
      <path d="M5 5L12.8399 12.8399" stroke={props.color} strokeWidth={2} strokeLinecap="round" />
      <path d="M13 5L5.1601 12.8399" stroke={props.color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  </React.Fragment>
);

CloseWithCircleSVG.defaultProps = {
  width: 15,
  height: 15,
  color: 'black',
};

CloseWithCircleSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
