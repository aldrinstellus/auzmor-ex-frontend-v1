import React from 'react';
import PropTypes from 'prop-types';

export const ForumNewSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.3333 9.83335V6.50002C17.3333 2.33335 15.6666 0.666687 11.5 0.666687H6.49996C2.33329 0.666687 0.666626 2.33335 0.666626 6.50002V11.5C0.666626 15.6667 2.33329 17.3334 6.49996 17.3334H9.83329"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.3334 15.1917L13.65 16.5L16.5 13.1667"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.83337 7.75V10.25"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9 7.75V10.25"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.1666 7.75V10.25"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

ForumNewSVG.defaultProps = {
  width: 18,
  height: 18,
  color: '#737373',
};

ForumNewSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
