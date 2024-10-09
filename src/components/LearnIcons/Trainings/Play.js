import React from 'react';
import PropTypes from 'prop-types';

export const PlaySVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.00004 14.6666H10C13.3334 14.6666 14.6667 13.3333 14.6667 9.99992V5.99992C14.6667 2.66659 13.3334 1.33325 10 1.33325H6.00004C2.66671 1.33325 1.33337 2.66659 1.33337 5.99992V9.99992C1.33337 13.3333 2.66671 14.6666 6.00004 14.6666Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.06665 7.99999V7.01333C6.06665 5.73999 6.96665 5.22666 8.06665 5.85999L8.91998 6.35333L9.77332 6.84666C10.8733 7.47999 10.8733 8.51999 9.77332 9.15333L8.91998 9.64666L8.06665 10.14C6.96665 10.7733 6.06665 10.2533 6.06665 8.98666V7.99999Z"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

PlaySVG.defaultProps = {
  width: 16,
  height: 16,
  color: '#DDDDDD',
};

PlaySVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
