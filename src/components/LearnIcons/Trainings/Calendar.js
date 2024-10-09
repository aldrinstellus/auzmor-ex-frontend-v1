import React from 'react';
import PropTypes from 'prop-types';

export const CalendarNewSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 14 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.33301 1.33325V3.33325"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.66699 1.33325V3.33325"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.33301 6.06006H12.6663"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 5.66659V11.3333C13 13.3333 12 14.6666 9.66667 14.6666H4.33333C2 14.6666 1 13.3333 1 11.3333V5.66659C1 3.66659 2 2.33325 4.33333 2.33325H9.66667C12 2.33325 13 3.66659 13 5.66659Z"
      stroke={color}
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.46346 9.13338H9.46945"
      stroke={color}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.46346 11.1334H9.46945"
      stroke={color}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.99666 9.13338H7.00265"
      stroke={color}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.99666 11.1334H7.00265"
      stroke={color}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.52987 9.13338H4.53585"
      stroke={color}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.52987 11.1334H4.53585"
      stroke={color}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

CalendarNewSVG.defaultProps = {
  width: 14,
  height: 16,
  color: 'white',
};

CalendarNewSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
