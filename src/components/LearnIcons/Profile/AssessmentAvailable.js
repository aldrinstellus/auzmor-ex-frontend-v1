import React from 'react';
import PropTypes from 'prop-types';

export const AssesmentAvailableSVG = props => (
  <svg height={props.height} width={props.width} viewBox="0 0 16 16" fill="none" {...props} xmlns="http://www.w3.org/2000/svg">
    <path d="M13.3332 5.49998V12C13.3332 14 12.1398 14.6666 10.6665 14.6666H5.33317C3.85984 14.6666 2.6665 14 2.6665 12V5.49998C2.6665 3.33331 3.85984 2.83331 5.33317 2.83331C5.33317 3.24665 5.49982 3.61998 5.77315 3.89331C6.04649 4.16664 6.41984 4.33331 6.83317 4.33331H9.1665C9.99317 4.33331 10.6665 3.65998 10.6665 2.83331C12.1398 2.83331 13.3332 3.33331 13.3332 5.49998Z" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.6668 2.83331C10.6668 3.65998 9.9935 4.33331 9.16683 4.33331H6.8335C6.42016 4.33331 6.04681 4.16664 5.77348 3.89331C5.50014 3.61998 5.3335 3.24665 5.3335 2.83331C5.3335 2.00665 6.00683 1.33331 6.8335 1.33331H9.16683C9.58016 1.33331 9.95351 1.49998 10.2268 1.77332C10.5002 2.04665 10.6668 2.41998 10.6668 2.83331Z" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.3335 8.66669H8.00016" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.3335 11.3333H10.6668" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

AssesmentAvailableSVG.defaultProps = {
  width: 16,
  height: 16,
  color: '#FF3366',
};

AssesmentAvailableSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
