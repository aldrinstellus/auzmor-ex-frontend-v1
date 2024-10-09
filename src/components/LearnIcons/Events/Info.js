import React from 'react';
import PropTypes from 'prop-types';

export const InfoSVG = props => (
  <svg
    width={props.width}
    height={props.height}
    viewBox="0 0 15 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.3571 14.6666C11.039 14.6666 14.0238 11.6818 14.0238 7.99992C14.0238 4.31802 11.039 1.33325 7.3571 1.33325C3.6752 1.33325 0.69043 4.31802 0.69043 7.99992C0.69043 11.6818 3.6752 14.6666 7.3571 14.6666Z"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.35742 10.6667V8"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.35742 5.33337H7.36409"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

InfoSVG.defaultProps = {
  width: 19,
  height: 16,
  color: '#F36',
};

InfoSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
