import PropTypes from 'prop-types';
import React from 'react';

export const CourseDeleteSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 13 17" {...props}>
    <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <g transform="translate(-257.000000, -7559.000000)">
        <g transform="translate(252.000000, 7556.000000)">
          <polygon points="0 0 24 0 24 24 0 24" />
          <path d="M6.625,17.625 C6.625,18.5875 7.4125,19.375 8.375,19.375 L15.375,19.375 C16.3375,19.375 17.125,18.5875 17.125,17.625 L17.125,7.125 L6.625,7.125 L6.625,17.625 Z M18,4.5 L14.9375,4.5 L14.0625,3.625 L9.6875,3.625 L8.8125,4.5 L5.75,4.5 L5.75,6.25 L18,6.25 L18,4.5 Z" fill={props.color} fillRule="nonzero" />
        </g>
      </g>
    </g>
  </svg>
);

CourseDeleteSVG.defaultProps = {
  width: 13,
  height: 17,
  color: '#101010',
};

CourseDeleteSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
