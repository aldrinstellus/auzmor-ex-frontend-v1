import React from 'react';
import PropTypes from 'prop-types';

export const TaskSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.4993 0.666992H5.49935C5.03911 0.666992 4.66602 1.04009 4.66602 1.50033V3.16699C4.66602 3.62723 5.03911 4.00033 5.49935 4.00033H10.4993C10.9596 4.00033 11.3327 3.62723 11.3327 3.16699V1.50033C11.3327 1.04009 10.9596 0.666992 10.4993 0.666992Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.334 2.33301H13.0007C13.4427 2.33301 13.8666 2.5086 14.1792 2.82116C14.4917 3.13372 14.6673 3.55765 14.6673 3.99967V15.6663C14.6673 16.1084 14.4917 16.5323 14.1792 16.8449C13.8666 17.1574 13.4427 17.333 13.0007 17.333H3.00065C2.55862 17.333 2.1347 17.1574 1.82214 16.8449C1.50958 16.5323 1.33398 16.1084 1.33398 15.6663V3.99967C1.33398 3.55765 1.50958 3.13372 1.82214 2.82116C2.1347 2.5086 2.55862 2.33301 3.00065 2.33301H4.66732"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.5 10.6667L7.16667 12.3333L10.5 9"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

TaskSVG.defaultProps = {
  width: 16,
  height: 18,
  color: '#5C5C5C',
};

TaskSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
