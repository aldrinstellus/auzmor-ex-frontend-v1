import PropTypes from 'prop-types';
import React from 'react';

export const ChangeRequestSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 20C15.2467 20 19.5 15.7467 19.5 10.5C19.5 5.25329 15.2467 1 10 1C4.75329 1 0.5 5.25329 0.5 10.5C0.5 15.7467 4.75329 20 10 20Z" fill={props.color} stroke={props.stroke} />
      <path d="M5.875 10.5C5.875 9.40598 6.3096 8.35677 7.08318 7.58318C7.85677 6.8096 8.90598 6.375 10 6.375C11.1532 6.37934 12.2601 6.82931 13.0892 7.63083" stroke={props.stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.7917 6V8.29167H11.5" stroke={props.stroke} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.1204 10.5C14.1204 11.594 13.6858 12.6432 12.9122 13.4168C12.1386 14.1904 11.0894 14.625 9.99542 14.625C8.84223 14.6207 7.73536 14.1707 6.90625 13.3692" stroke={props.stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.79167 13H6.5V15.2917" stroke={props.stroke} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

ChangeRequestSVG.defaultProps = {
  width: 20,
  height: 21,
  color: '#FF0000',
  stroke: 'white',
};

ChangeRequestSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  stroke: PropTypes.string,
};
