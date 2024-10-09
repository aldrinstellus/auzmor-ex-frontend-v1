import React from 'react';
import PropTypes from 'prop-types';

export const ForumSVG = props => (
  <svg
    width={props.width}
    height={props.height}
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.875 6.875C13.875 10.2612 10.935 13 7.3125 13L6.49876 13.98L6.0175 14.5575C5.60625 15.0475 4.81875 14.9425 4.5475 14.3562L3.375 11.775C1.7825 10.655 0.75 8.87875 0.75 6.875C0.75 3.48875 3.69 0.75 7.3125 0.75C9.955 0.75 12.2388 2.21126 13.2625 4.31126C13.6563 5.09001 13.875 5.95625 13.875 6.875Z"
      stroke={props.color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.25 10.2525C18.25 12.2563 17.2175 14.0325 15.625 15.1525L14.4525 17.7337C14.1813 18.32 13.3938 18.4338 12.9825 17.935L11.6875 16.3775C9.57002 16.3775 7.68003 15.4413 6.49878 13.98L7.31252 13C10.935 13 13.875 10.2613 13.875 6.87502C13.875 5.95627 13.6563 5.09003 13.2625 4.31128C16.1238 4.96753 18.25 7.38251 18.25 10.2525Z"
      stroke={props.color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.125 6.875H9.5"
      stroke={props.color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

ForumSVG.defaultProps = {
  width: 19,
  height: 19,
  color: '#FF3366',
};

ForumSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
