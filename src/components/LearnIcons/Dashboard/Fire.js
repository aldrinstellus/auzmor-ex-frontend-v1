import React from 'react';
import PropTypes from 'prop-types';

export const FireSVG = props => (
  <svg
    width={props.width}
    height={props.height}
    viewBox="0 0 17 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.5 21C12.8496 21 16.375 18.375 16.375 13.7812C16.375 11.8125 15.7188 8.53125 13.0938 5.90625C13.4219 7.875 11.4531 8.53125 11.4531 8.53125C12.4375 5.25 9.8125 0.65625 5.875 0C6.34356 2.625 6.53125 5.25 3.25 7.875C1.60938 9.1875 0.625 11.4568 0.625 13.7812C0.625 18.375 4.15038 21 8.5 21ZM8.5 19.6875C6.32519 19.6875 4.5625 18.375 4.5625 16.0781C4.5625 15.0938 4.89062 13.4531 6.20312 12.1406C6.03906 13.125 7.1875 13.7812 7.1875 13.7812C6.69531 12.1406 7.84375 9.51562 9.8125 9.1875C9.57756 10.5 9.48438 11.8125 11.125 13.125C11.9453 13.7812 12.4375 14.9153 12.4375 16.0781C12.4375 18.375 10.6748 19.6875 8.5 19.6875Z"
      fill={props.color}
    />
  </svg>
);

FireSVG.defaultProps = {
  width: 17,
  height: 21,
  color: '#111111',
};

FireSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
