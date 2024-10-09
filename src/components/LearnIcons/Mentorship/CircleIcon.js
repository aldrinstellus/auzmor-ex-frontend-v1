import PropTypes from 'prop-types';
import React from 'react';

export const CircleIconSVG = ({
  width, height, color, ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 13 13"
    fill="none"
    {...props}
  >
    <path
      d="M12.25 6.5C12.25 9.67564 9.67564 12.25 6.5 12.25C3.32436 12.25 0.75 9.67564 0.75 6.5C0.75 3.32436 3.32436 0.75 6.5 0.75C9.67564 0.75 12.25 3.32436 12.25 6.5Z"
      fill="white"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

CircleIconSVG.defaultProps = {
  width: 13,
  height: 13,
  color: 'white',
};

CircleIconSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
