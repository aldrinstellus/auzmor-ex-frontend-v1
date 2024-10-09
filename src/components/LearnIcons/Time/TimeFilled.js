import React from 'react';
import PropTypes from 'prop-types';

export const TimeFilledSVG = props => (
  <svg
    height={props.height}
    width={props.width}
    viewBox="0 0 14 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.00006 2.4873C3.41506 2.4873 0.497559 5.4048 0.497559 8.9898C0.497559 12.5748 3.41506 15.4998 7.00006 15.4998C10.5851 15.4998 13.5026 12.5823 13.5026 8.9973C13.5026 5.4123 10.5851 2.4873 7.00006 2.4873ZM7.56256 8.7498C7.56256 9.0573 7.30756 9.3123 7.00006 9.3123C6.69256 9.3123 6.43756 9.0573 6.43756 8.7498V4.9998C6.43756 4.6923 6.69256 4.4373 7.00006 4.4373C7.30756 4.4373 7.56256 4.6923 7.56256 4.9998V8.7498Z"
      fill={props.color}
    />
    <path
      d="M9.16748 1.5875H4.83248C4.53248 1.5875 4.29248 1.3475 4.29248 1.0475C4.29248 0.7475 4.53248 0.5 4.83248 0.5H9.16748C9.46748 0.5 9.70748 0.74 9.70748 1.04C9.70748 1.34 9.46748 1.5875 9.16748 1.5875Z"
      fill={props.color}
    />
  </svg>
);

TimeFilledSVG.defaultProps = {
  width: 14,
  height: 16,
  color: '#000',
};

TimeFilledSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
