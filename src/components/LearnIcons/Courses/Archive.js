import PropTypes from 'prop-types';
import React from 'react';

export const CourseArchiveSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 16 16" {...props}>
    <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <g transform="translate(-167.000000, -7560.000000)">
        <g transform="translate(163.000000, 7556.000000)">
          <polygon points="0 0 24 0 24 24 0 24" />
          <path d="M19.4916667,6.35833333 L18.3333333,4.95833333 C18.1083333,4.675 17.7666667,4.5 17.375,4.5 L7.375,4.5 C6.98333333,4.5 6.64166667,4.675 6.40833333,4.95833333 L5.25833333,6.35833333 C5.01666667,6.64166667 4.875,7.01666667 4.875,7.41666667 L4.875,17.8333333 C4.875,18.75 5.625,19.5 6.54166667,19.5 L18.2083333,19.5 C19.125,19.5 19.875,18.75 19.875,17.8333333 L19.875,7.41666667 C19.875,7.01666667 19.7333333,6.64166667 19.4916667,6.35833333 Z M12.375,16.5833333 L7.79166667,12 L10.7083333,12 L10.7083333,10.3333333 L14.0416667,10.3333333 L14.0416667,12 L16.9583333,12 L12.375,16.5833333 Z M6.64166667,6.16666667 L7.31666667,5.33333333 L17.3166667,5.33333333 L18.1,6.16666667 L6.64166667,6.16666667 Z" id="ArchiveShape" fill={props.color} fillRule="nonzero" />
        </g>
      </g>
    </g>
  </svg>
);

CourseArchiveSVG.defaultProps = {
  width: 16,
  height: 16,
  color: '#101010',
};

CourseArchiveSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
