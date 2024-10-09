import React from 'react';
import PropTypes from 'prop-types';

export const ArchivedSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 14 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.6667 2.33203V3.66536C13.6667 4.88536 13.1134 5.54536 12 5.64536C11.8934 5.6587 11.78 5.66536 11.6667 5.66536H2.33337C2.22004 5.66536 2.10671 5.6587 2.00004 5.64536C0.886707 5.54536 0.333374 4.88536 0.333374 3.66536V2.33203C0.333374 0.998698 1.00004 0.332031 2.33337 0.332031H11.6667C13 0.332031 13.6667 0.998698 13.6667 2.33203Z"
      fill={color}
    />
    <path
      d="M2.66667 6.5C2.3 6.5 2 6.8 2 7.16667V11.6667C2 13 2.33333 13.6667 4 13.6667H10C11.6667 13.6667 12 13 12 11.6667V7.16667C12 6.8 11.7 6.5 11.3333 6.5H2.66667ZM8.21333 9.5H5.78667C5.51333 9.5 5.28667 9.27333 5.28667 9C5.28667 8.72667 5.51333 8.5 5.78667 8.5H8.21333C8.48667 8.5 8.71333 8.72667 8.71333 9C8.71333 9.27333 8.48667 9.5 8.21333 9.5Z"
      fill={color}
    />
  </svg>
);

ArchivedSVG.defaultProps = {
  width: 14,
  height: 14,
  color: 'white',
};

ArchivedSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
