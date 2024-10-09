import React from 'react';
import PropTypes from 'prop-types';

export const CartNewSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.666687 0.666687H2.11669C3.01669 0.666687 3.72502 1.44169 3.65002 2.33335L2.95835 10.6333C2.84169 11.9917 3.91668 13.1583 5.28335 13.1583H14.1584C15.3584 13.1583 16.4084 12.175 16.5 10.9834L16.95 4.73336C17.05 3.35002 16 2.22502 14.6084 2.22502H3.85003"
      stroke={color}
      strokeWidth="1.2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.5417 17.3333C13.117 17.3333 13.5833 16.867 13.5833 16.2917C13.5833 15.7164 13.117 15.25 12.5417 15.25C11.9664 15.25 11.5 15.7164 11.5 16.2917C11.5 16.867 11.9664 17.3333 12.5417 17.3333Z"
      stroke={color}
      strokeWidth="1.2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.87498 17.3333C6.45028 17.3333 6.91665 16.867 6.91665 16.2917C6.91665 15.7164 6.45028 15.25 5.87498 15.25C5.29968 15.25 4.83331 15.7164 4.83331 16.2917C4.83331 16.867 5.29968 17.3333 5.87498 17.3333Z"
      stroke={color}
      strokeWidth="1.2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 5.66669H16.5"
      stroke={color}
      strokeWidth="1.2"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

CartNewSVG.defaultProps = {
  width: 18,
  height: 18,
  color: '#737373',
};

CartNewSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
