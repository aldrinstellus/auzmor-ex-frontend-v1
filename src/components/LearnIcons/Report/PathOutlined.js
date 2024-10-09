import React from 'react';
import PropTypes from 'prop-types';

export const PathOutlinedSVG = props => (
  <svg width={props.width} height={props.height} {...props}>
    <g fill="none" fillRule="evenodd">
      <path
        d="M12.046 41c6.234 0 12.354-4.68 11.287-10.27-.772-4.045-7.028-.537-8.086-2.101-1.987-2.935.866-8.17-3.2-8.17C5.812 20.46-.389 25.155.76 30.73c.65 3.16 5.167.523 5.9 1.885C8.494 36.025 7.59 41 12.045 41z"
        fill={props.color}
        fillRule="nonzero"
      />
      <g stroke="#000" strokeLinecap="round" strokeLinejoin="round">
        <path
          strokeWidth={1.137}
          d="M35.863 19.212H33.13M34.366 23.881h-1.962"
        />
        <path
          d="M15.006 30.055c7.942 2.832 17.398 2.657 17.398 2.657 3.628 0 2.857-4.163.234-4.163H31.59M15.006 15.956s7.488-6.15 6.95-12.58c-.407-4.88 8.264-1.148 3.437 11.167h10.7c2.985 0 2.976 4.669 0 4.669h-.23c3.008 0 2.929 4.669 0 4.669h-1.497c2.984 0 2.976 4.668 0 4.668h-1.728M6.135 14.514h8.87v18.533h-8.87z"
          strokeWidth={1.5}
        />
      </g>
    </g>
  </svg>
);

PathOutlinedSVG.defaultProps = {
  width: 40,
  height: 41,
  color: '#F36',
};

PathOutlinedSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
