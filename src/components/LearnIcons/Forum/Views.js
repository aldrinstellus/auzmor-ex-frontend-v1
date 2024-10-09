import React from 'react';
import PropTypes from 'prop-types';

export const ViewsSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 22 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 0C5.19875 0 0.5 5.25 0.5 5.25C0.5 5.25 5.19875 10.5 11 10.5C16.8013 10.5 21.5 5.25 21.5 5.25C21.5 5.25 16.8013 0 11 0ZM11 8.53125C10.351 8.53125 9.71661 8.33881 9.17701 7.97826C8.63741 7.61771 8.21688 7.10523 7.96853 6.50566C7.72018 5.90609 7.65519 5.24635 7.7818 4.60985C7.9084 3.97335 8.22092 3.3887 8.67981 2.92981C9.1387 2.47092 9.72335 2.1584 10.3599 2.0318C10.9964 1.90519 11.6561 1.97018 12.2557 2.21853C12.8552 2.46688 13.3677 2.88745 13.7283 3.42705C14.0888 3.96665 14.2812 4.60103 14.2812 5.25C14.2812 6.12024 13.9355 6.95483 13.3202 7.57019C12.7048 8.18554 11.8702 8.53125 11 8.53125Z" stroke={props.color} />
    </svg>
  </React.Fragment>
);

ViewsSVG.defaultProps = {
  width: 22,
  height: 11,
  color: 'black',
};

ViewsSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
