import PropTypes from 'prop-types';
import React from 'react';

export const FeedFilledSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M2.25 4.625V13.375C2.25 14.4796 3.14543 15.375 4.25 15.375H12.75H13.125L12.625 15.375L12.6259 5.24703L12.75 5.24704V4.625C12.75 3.52043 11.8546 2.625 10.75 2.625H4.25C3.14543 2.625 2.25 3.52043 2.25 4.625ZM13.6259 5.25L13.625 15.375H14.25C15.0784 15.375 15.75 14.7034 15.75 13.875V7.25C15.75 6.14543 14.8546 5.25 13.75 5.25H13.6259Z" fill={color} />
    <path d="M4.875 12H10.125" stroke="white" strokeLinecap="round" />
    <path d="M8.625 9H6.375C5.54657 9 4.875 8.32843 4.875 7.5C4.875 6.67157 5.54657 6 6.375 6H8.625C9.45343 6 10.125 6.67157 10.125 7.5C10.125 8.32843 9.45343 9 8.625 9Z" stroke="white" strokeLinecap="round" />
  </svg>
);

FeedFilledSVG.defaultProps = {
  width: 18,
  height: 18,
  color: '#FF3366',
};

FeedFilledSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
