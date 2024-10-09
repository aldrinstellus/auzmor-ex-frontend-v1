import PropTypes from 'prop-types';
import React from 'react';

export const DeleteIconSVG = ({
  width, height, color, ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      d="M2.5 5H4.16667H17.5"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.8329 5.0013V16.668C15.8329 17.11 15.6573 17.5339 15.3448 17.8465C15.0322 18.159 14.6083 18.3346 14.1663 18.3346H5.83293C5.3909 18.3346 4.96698 18.159 4.65442 17.8465C4.34185 17.5339 4.16626 17.11 4.16626 16.668V5.0013M6.66626 5.0013V3.33464C6.66626 2.89261 6.84185 2.46868 7.15442 2.15612C7.46698 1.84356 7.8909 1.66797 8.33293 1.66797H11.6663C12.1083 1.66797 12.5322 1.84356 12.8448 2.15612C13.1573 2.46868 13.3329 2.89261 13.3329 3.33464V5.0013"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.33374 9.16797V14.168"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.6663 9.16797V14.168"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

DeleteIconSVG.defaultProps = {
  width: 20,
  height: 20,
  color: '#171717',
};

DeleteIconSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
