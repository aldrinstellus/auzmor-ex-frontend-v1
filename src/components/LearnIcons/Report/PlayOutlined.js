import PropTypes from 'prop-types';
import React from 'react';

export const PlayOutlinedSVG = props => (
  <svg width={props.width} height={props.height} {...props} viewBox="0 0 40 40">
    <path
      d="M20.1 39.375c10.703 0 19.375-8.672 19.375-19.375S30.803.625 20.1.625.725 9.297.725 20 9.397 39.375 20.1 39.375zm0-2.5c-9.273 0-16.875-7.508-16.875-16.875 0-9.273 7.508-16.875 16.875-16.875 9.273 0 16.875 7.508 16.875 16.875 0 9.273-7.508 16.875-16.875 16.875zm-4.711-7.11l13.75-7.89c1.281-.71 1.281-2.562 0-3.281l-13.75-8.36c-1.234-.687-2.789.196-2.789 1.641v16.25c0 1.438 1.547 2.328 2.789 1.64zm-.289-3.53V13.82c0-.367.398-.593.71-.398l10.509 6.383a.468.468 0 01-.008.804l-10.508 6.032a.47.47 0 01-.703-.407z"
      fill={props.color}
      fillRule="nonzero"
    />
  </svg>
);

PlayOutlinedSVG.defaultProps = {
  width: 40,
  height: 40,
  color: '#F36',
};

PlayOutlinedSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
