import React from 'react';
import PropTypes from 'prop-types';

export const TaskUpdateNotificationSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20" cy="20" r="20" fill={props.color} />
    <path d="M22.4993 11.667H17.4993C17.0391 11.667 16.666 12.0401 16.666 12.5003V14.167C16.666 14.6272 17.0391 15.0003 17.4993 15.0003H22.4993C22.9596 15.0003 23.3327 14.6272 23.3327 14.167V12.5003C23.3327 12.0401 22.9596 11.667 22.4993 11.667Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M23.334 13.333H25.0007C25.4427 13.333 25.8666 13.5086 26.1792 13.8212C26.4917 14.1337 26.6673 14.5576 26.6673 14.9997V26.6663C26.6673 27.1084 26.4917 27.5323 26.1792 27.8449C25.8666 28.1574 25.4427 28.333 25.0007 28.333H15.0007C14.5586 28.333 14.1347 28.1574 13.8221 27.8449C13.5096 27.5323 13.334 27.1084 13.334 26.6663V14.9997C13.334 14.5576 13.5096 14.1337 13.8221 13.8212C14.1347 13.5086 14.5586 13.333 15.0007 13.333H16.6673" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17.5 21.6667L19.1667 23.3333L22.5 20" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
  </svg>

);

TaskUpdateNotificationSVG.defaultProps = {
  width: 40,
  height: 40,
  color: '#FF9001',
};

TaskUpdateNotificationSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
