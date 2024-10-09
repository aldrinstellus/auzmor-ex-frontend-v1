import React from 'react';
import PropTypes from 'prop-types';

export const UserPlaceholderSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 35 37" fill="none">
    <path d="M9.0625 9.1875C9.0625 13.8394 12.8481 17.625 17.5 17.625C22.1519 17.625 25.9375 13.8394 25.9375 9.1875C25.9375 4.53562 22.1519 0.75 17.5 0.75C12.8481 0.75 9.0625 4.53562 9.0625 9.1875ZM32.5 36.375H34.375V34.5C34.375 27.2644 28.4856 21.375 21.25 21.375H13.75C6.5125 21.375 0.625 27.2644 0.625 34.5V36.375H32.5Z" fill="black" fillOpacity="0.28" />
  </svg>
);


UserPlaceholderSVG.defaultProps = {
  width: 35,
  height: 37,
};

UserPlaceholderSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
