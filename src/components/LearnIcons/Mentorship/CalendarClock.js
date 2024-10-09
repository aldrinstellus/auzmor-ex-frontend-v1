import PropTypes from 'prop-types';
import React from 'react';

export const CalendarClockSVG = ({
  width, height, color, ...props
}) => (
  <svg width={width} height={height} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M14.5 4.99935V3.99935C14.5 3.64573 14.3595 3.30659 14.1095 3.05654C13.8594 2.80649 13.5203 2.66602 13.1667 2.66602H3.83333C3.47971 2.66602 3.14057 2.80649 2.89052 3.05654C2.64048 3.30659 2.5 3.64573 2.5 3.99935V13.3327C2.5 13.6863 2.64048 14.0254 2.89052 14.2755C3.14057 14.5255 3.47971 14.666 3.83333 14.666H6.16667" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.1667 1.33398V4.00065" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.83325 1.33398V4.00065" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2.5 6.66602H5.83333" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.1667 11.6673L11.1667 10.834V9.33398" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.1667 10.666C15.1667 11.7269 14.7453 12.7443 13.9952 13.4944C13.245 14.2446 12.2276 14.666 11.1667 14.666C10.1059 14.666 9.08847 14.2446 8.33832 13.4944C7.58818 12.7443 7.16675 11.7269 7.16675 10.666C7.16675 9.60515 7.58818 8.58773 8.33832 7.83759C9.08847 7.08744 10.1059 6.66602 11.1667 6.66602C12.2276 6.66602 13.245 7.08744 13.9952 7.83759C14.7453 8.58773 15.1667 9.60515 15.1667 10.666V10.666Z" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

CalendarClockSVG.defaultProps = {
  width: 16,
  height: 16,
  color: '#171717',
};

CalendarClockSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
