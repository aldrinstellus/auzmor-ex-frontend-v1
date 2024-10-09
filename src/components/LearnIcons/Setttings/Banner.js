import React from 'react';
import PropTypes from 'prop-types';

export const BannerSVG = props => (
  <svg
    width={props.width}
    height={props.height}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 21H14C19 21 21 19 21 14V8C21 3 19 1 14 1H8C3 1 1 3 1 8V14C1 19 3 21 8 21Z"
      stroke={props.color}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 9C9.10457 9 10 8.10457 10 7C10 5.89543 9.10457 5 8 5C6.89543 5 6 5.89543 6 7C6 8.10457 6.89543 9 8 9Z"
      stroke={props.color}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.66992 17.95L6.59992 14.64C7.38992 14.11 8.52992 14.17 9.23992 14.78L9.56992 15.07C10.3499 15.74 11.6099 15.74 12.3899 15.07L16.5499 11.5C17.3299 10.83 18.5899 10.83 19.3699 11.5L20.9999 12.9"
      stroke={props.color}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

BannerSVG.defaultProps = {
  width: 22,
  height: 22,
  color: '#FF3366',
};

BannerSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
