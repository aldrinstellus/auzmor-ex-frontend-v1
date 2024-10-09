import React from 'react';
import PropTypes from 'prop-types';

export const ArchivedOutlinedSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.3335 2.66675H2.66683C1.93045 2.66675 1.3335 3.2637 1.3335 4.00008V4.66675C1.3335 5.40313 1.93045 6.00008 2.66683 6.00008H13.3335C14.0699 6.00008 14.6668 5.40313 14.6668 4.66675V4.00008C14.6668 3.2637 14.0699 2.66675 13.3335 2.66675Z" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.6665 6V12C2.6665 12.3536 2.80698 12.6928 3.05703 12.9428C3.30708 13.1929 3.64622 13.3333 3.99984 13.3333H11.9998C12.3535 13.3333 12.6926 13.1929 12.9426 12.9428C13.1927 12.6928 13.3332 12.3536 13.3332 12V6" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.6665 8.66675H9.33317" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

ArchivedOutlinedSVG.defaultProps = {
  width: 16,
  height: 16,
  color: '#FF3366',
};

ArchivedOutlinedSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
