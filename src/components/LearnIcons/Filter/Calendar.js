import React from 'react';
import PropTypes from 'prop-types';

export const CalendarSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 15 15" fill="none" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M13.2 1.32344H12.15V1.02933C12.15 0.529326 11.76 0.146973 11.25 0.146973C10.74 0.146973 10.35 0.529326 10.35 1.02933V1.32344H4.65V1.02933C4.65 0.529326 4.26 0.146973 3.75 0.146973C3.24 0.146973 2.85 0.529326 2.85 1.02933V1.32344H1.8C0.81 1.32344 0 2.11756 0 3.08815V6.17638V13.0881C0 14.0587 0.81 14.8529 1.8 14.8529H13.2C14.19 14.8529 15 14.0587 15 13.0881V6.17638V3.08815C15 2.11756 14.19 1.32344 13.2 1.32344ZM13.8 13.0881C13.8 13.4117 13.53 13.6764 13.2 13.6764H1.8C1.47 13.6764 1.2 13.4117 1.2 13.0881V6.76462H13.8V13.0881ZM1.2 5.58815H13.8V3.08815C13.8 2.76462 13.53 2.49991 13.2 2.49991H12.06C11.94 2.85286 11.61 3.08815 11.22 3.08815C10.83 3.08815 10.5 2.85286 10.38 2.49991H4.59C4.47 2.85286 4.14 3.08815 3.75 3.08815C3.36 3.08815 3.03 2.85286 2.91 2.49991H1.8C1.47 2.49991 1.2 2.76462 1.2 3.08815V5.58815Z" fill={props.color} />
      <rect x="8.1001" y="7.64697" width="1.8" height="1.76471" fill={props.color} />
      <rect x="11.1001" y="7.64697" width="1.8" height="1.76471" fill={props.color} />
      <rect x="2.1001" y="10.2939" width="1.8" height="1.76471" fill={props.color} />
      <rect x="5.1001" y="10.2939" width="1.8" height="1.76471" fill={props.color} />
      <rect x="8.1001" y="10.2939" width="1.8" height="1.76471" fill={props.color} />
    </svg>
  </React.Fragment>
);

CalendarSVG.defaultProps = {
  width: 15,
  height: 15,
  color: 'black',
};

CalendarSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
