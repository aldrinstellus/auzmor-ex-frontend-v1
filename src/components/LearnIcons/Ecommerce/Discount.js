import React from 'react';
import PropTypes from 'prop-types';

export const DiscountSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M9.3158 2.68127L1.32186 10.6752C1.15252 10.8446 1.05633 11.0732 1.05447 11.3108C1.0526 11.5484 1.1452 11.7755 1.3119 11.9422L6.34022 16.9706C6.50692 17.1373 6.73406 17.2299 6.97167 17.228C7.20929 17.2262 7.43791 17.1299 7.60725 16.9606L15.6012 8.96667C15.6969 8.8716 15.7704 8.75661 15.8164 8.63018C15.8623 8.50375 15.8795 8.3691 15.8667 8.23609L15.3957 3.67874C15.3749 3.47659 15.2857 3.28865 15.1429 3.14584C15.0001 3.00304 14.8122 2.91388 14.61 2.89307L10.0527 2.4221C9.91913 2.40748 9.78357 2.42318 9.656 2.46805C9.52843 2.51292 9.41214 2.5858 9.3158 2.68127V2.68127Z" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.1295 7.1524C11.6502 7.6731 12.4944 7.6731 13.0151 7.1524C13.5358 6.6317 13.5358 5.78748 13.0151 5.26678C12.4944 4.74608 11.6502 4.74608 11.1295 5.26678C10.6088 5.78748 10.6088 6.6317 11.1295 7.1524Z" fill={props.color} />
  </svg>
);

DiscountSVG.defaultProps = {
  width: 29,
  height: 24,
  color: '#FF3366',
};

DiscountSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
