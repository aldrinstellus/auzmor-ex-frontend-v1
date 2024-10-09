import PropTypes from 'prop-types';
import React from 'react';

export const MilestoneFlagIcon = ({
  width, height, color, ...props
}) => (
  <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="8" cy="8" r="7.5" fill="white" stroke={color} />
    <g clipPath="url(#clip0_6547_152413)">
      <path d="M6.13281 14.133V3.46631L11.4661 6.13298L6.13281 8.79964" fill={color} />
      <path d="M6.13281 14.133V3.46631L11.4661 6.13298L6.13281 8.79964" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <defs>
      <clipPath id="clip0_6547_152413">
        <rect width="12.8" height="12.8" fill="white" transform="translate(2.40039 2.3999)" />
      </clipPath>
    </defs>
  </svg>

);


MilestoneFlagIcon.defaultProps = {
  width: 16,
  height: 16,
  color: '#737373',
};

MilestoneFlagIcon.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
