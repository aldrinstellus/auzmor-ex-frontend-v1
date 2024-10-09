import PropTypes from 'prop-types';
import React from 'react';

export const ModernFilterApplied = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12.2 33H21.8C29.8 33 33 29.8 33 21.8V12.2C33 4.2 29.8 1 21.8 1H12.2C4.2 1 1 4.2 1 12.2V21.8C1 29.8 4.2 33 12.2 33Z" fill={props.color} stroke="#333333" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.5603 9.4209H22.4262C23.3328 9.4209 24.0695 10.1576 24.0695 11.0642V12.8776C24.0695 13.5434 23.6587 14.3651 23.2478 14.7759L19.7062 17.9067C19.2103 18.3176 18.8845 19.1392 18.8845 19.8051V23.3467C18.8845 23.8426 18.5587 24.4942 18.1478 24.7492L17.0003 25.4717C15.9237 26.1376 14.4503 25.3867 14.4503 24.0692V19.7059C14.4503 19.1251 14.1245 18.3884 13.7845 17.9776L10.6537 14.6767C10.2428 14.2801 9.91699 13.5292 9.91699 13.0334V11.1492C9.91699 10.1576 10.6537 9.4209 11.5603 9.4209Z" stroke="#666666" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="26" cy="8" r="2.5" fill="#FF3365" stroke="white" />
  </svg>

);

ModernFilterApplied.defaultProps = {
  width: 34,
  height: 34,
  color: 'white',
};

ModernFilterApplied.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
