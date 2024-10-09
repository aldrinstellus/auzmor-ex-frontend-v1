import React from 'react';
import PropTypes from 'prop-types';

export const SpreadsheetSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 21 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.5833 1.66666H5.49998C5.05795 1.66666 4.63403 1.84225 4.32147 2.15481C4.00891 2.46737 3.83331 2.8913 3.83331 3.33332V16.6667C3.83331 17.1087 4.00891 17.5326 4.32147 17.8452C4.63403 18.1577 5.05795 18.3333 5.49998 18.3333H15.5C15.942 18.3333 16.3659 18.1577 16.6785 17.8452C16.9911 17.5326 17.1666 17.1087 17.1666 16.6667V6.24999L12.5833 1.66666Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.1667 1.66666V6.66666H17.1667"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.16669 10.8333H8.83335"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.16669 14.1667H8.83335"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.1667 10.8333H13.8334"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.1667 14.1667H13.8334"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

SpreadsheetSVG.defaultProps = {
  width: 21,
  height: 20,
  color: '#737373',
};

SpreadsheetSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
