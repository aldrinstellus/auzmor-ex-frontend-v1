import PropTypes from 'prop-types';
import React from 'react';

export const CourseEditSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 16 17" {...props}>
      <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
        <g transform="translate(-81.000000, -7559.000000)">
          <g transform="translate(77.000000, 7556.000000)">
            <polygon points="0 0 24 0 24 24 0 24" />
            <path d="M4,16.09375 L4,19.375 L7.28125,19.375 L16.95875,9.6975 L13.6775,6.41625 L4,16.09375 L4,16.09375 Z M19.49625,7.16 C19.8375,6.81875 19.8375,6.2675 19.49625,5.92625 L17.44875,3.87875 C17.1075,3.5375 16.55625,3.5375 16.215,3.87875 L14.61375,5.48 L17.895,8.76125 L19.49625,7.16 L19.49625,7.16 Z" fill={props.color} fillRule="nonzero" />
          </g>
        </g>
      </g>
    </svg>
  </React.Fragment>
);

CourseEditSVG.defaultProps = {
  width: 16,
  height: 17,
  color: '#101010',
};

CourseEditSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
