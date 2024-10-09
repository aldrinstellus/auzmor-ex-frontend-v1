import PropTypes from 'prop-types';
import React from 'react';

export const FeedSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M14.1667 5.83332H15.5C16.6046 5.83332 17.5 6.72875 17.5 7.83332V15.4167C17.5 16.3371 16.7538 17.0833 15.8333 17.0833V17.0833H14.1667M14.1667 5.83332V17.0833M14.1667 5.83332V4.91666C14.1667 3.81209 13.2712 2.91666 12.1667 2.91666H4.5C3.39543 2.91666 2.5 3.81209 2.5 4.91666V15.0833C2.5 16.1879 3.39543 17.0833 4.5 17.0833H14.1667" stroke={color} />
    <path d="M5.4165 13.3333H11.2498" stroke={color} strokeLinecap="round" />
    <path d="M9.58317 9.99999H7.08317C6.1627 9.99999 5.4165 9.2538 5.4165 8.33332C5.4165 7.41285 6.1627 6.66666 7.08317 6.66666H9.58317C10.5036 6.66666 11.2498 7.41285 11.2498 8.33332C11.2498 9.2538 10.5036 9.99999 9.58317 9.99999Z" stroke={color} strokeLinecap="round" />
  </svg>

);

FeedSVG.defaultProps = {
  width: 18,
  height: 18,
  color: '#737373',
};

FeedSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
