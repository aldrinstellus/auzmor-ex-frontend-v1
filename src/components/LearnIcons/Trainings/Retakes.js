import PropTypes from 'prop-types';
import React from 'react';

export const RetakesSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.99994 2.75C5.27285 2.75 2.25 5.77129 2.25 9.5001C2.25 13.2287 5.27292 16.25 8.99994 16.25C12.7271 16.25 15.75 13.2287 15.75 9.5001C15.75 5.77125 12.7271 2.75 8.99994 2.75Z"
      stroke={color}
    />
    <path
      d="M13.1322 10.2805C13.1322 11.5199 12.0919 12.6062 10.4024 13.2162L10.4 13.217C9.7984 13.4292 9.44505 12.5592 10.0166 12.2866C10.6816 11.9705 11.0372 11.5472 11.0372 11.1474C11.0372 10.5015 10.0858 9.88619 8.67515 9.71169L8.67529 10.2235C8.67529 10.7539 8.07917 11.0193 7.65986 10.7099L5.50847 8.8061C5.16793 8.55544 5.16782 8.04555 5.48492 7.81458L7.68377 5.87236C8.10303 5.56509 8.67505 5.87462 8.67505 6.37794L8.6752 6.92677C11.2526 7.2693 13.1322 8.61974 13.1322 10.2805Z"
      fill={color}
    />
  </svg>
);

RetakesSVG.defaultProps = {
  width: 18,
  height: 19,
  color: '#FF3366',
};

RetakesSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
