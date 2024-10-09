

import React from 'react';
import PropTypes from 'prop-types';

export const TasksOutlineSVG = ({ width, height, color }) => (
  <svg width={width} height={height} viewBox="2 1 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.6665 10.1667H12.4998" stroke={color} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.6665 13.5H10.3165" stroke={color} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.33317 4.99999H11.6665C13.3332 4.99999 13.3332 4.16666 13.3332 3.33332C13.3332 1.66666 12.4998 1.66666 11.6665 1.66666H8.33317C7.49984 1.66666 6.6665 1.66666 6.6665 3.33332C6.6665 4.99999 7.49984 4.99999 8.33317 4.99999Z" stroke={color} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13.3333 3.35001C16.1083 3.50001 17.5 4.52501 17.5 8.33334V13.3333C17.5 16.6667 16.6667 18.3333 12.5 18.3333H7.5C3.33333 18.3333 2.5 16.6667 2.5 13.3333V8.33334C2.5 4.53334 3.89167 3.50001 6.66667 3.35001" stroke={color} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

TasksOutlineSVG.defaultProps = {
  width: 20,
  height: 20,
  color: '#FF3366',
};

TasksOutlineSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
