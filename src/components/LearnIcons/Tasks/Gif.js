import React from 'react';
import PropTypes from 'prop-types';

export const GifSVG = props => (
  <svg
    width={props.width}
    height={props.height}
    viewBox="0 0 18 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.5 1H3C2.46957 1 1.96086 1.21071 1.58579 1.58579C1.21071 1.96086 1 2.46957 1 3V19C1 19.5304 1.21071 20.0391 1.58579 20.4142C1.96086 20.7893 2.46957 21 3 21H15C15.5304 21 16.0391 20.7893 16.4142 20.4142C16.7893 20.0391 17 19.5304 17 19V6.5L11.5 1Z"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11 1V7H17"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.78 13.528V15.814C6.522 15.916 6.018 16.048 5.472 16.048C3.486 16.048 3.234 14.47 3.234 13.738C3.234 12.25 4.212 11.362 5.586 11.362C6.036 11.362 6.426 11.44 6.654 11.554L6.498 12.124C6.282 12.028 6.006 11.95 5.586 11.95C4.644 11.95 3.966 12.544 3.966 13.708C3.966 14.866 4.596 15.478 5.496 15.478C5.796 15.478 6.006 15.436 6.108 15.382V14.086H5.316V13.528H6.78ZM7.61672 16V11.41H8.31272V16H7.61672ZM9.96506 16H9.26906V11.41H11.6571V11.992H9.96506V13.408H11.5371V13.984H9.96506V16Z"
      fill={props.color}
    />
  </svg>
);

GifSVG.defaultProps = {
  width: 18,
  height: 22,
  color: '#5C5C5C',
};

GifSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
