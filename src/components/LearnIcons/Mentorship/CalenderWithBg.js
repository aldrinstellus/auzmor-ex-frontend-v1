import PropTypes from 'prop-types';
import React from 'react';

export const CalendarWithBgSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="10.5" r="9.5" fill="#12B44D" stroke={props.color} strokeWidth="1.25" />
      <g clipPath="url(#clip0_1_4)">
        <path d="M14.5 6.5H7.5C6.94772 6.5 6.5 6.94772 6.5 7.5V14.5C6.5 15.0523 6.94772 15.5 7.5 15.5H14.5C15.0523 15.5 15.5 15.0523 15.5 14.5V7.5C15.5 6.94772 15.0523 6.5 14.5 6.5Z" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13 5.5V7.5" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 5.5V7.5" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.5 9.5H15.5" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_1_4">
          <rect width="12" height="12" fill={props.color} transform="translate(5 4.5)" />
        </clipPath>
      </defs>
    </svg>

  </React.Fragment>
);

CalendarWithBgSVG.defaultProps = {
  width: 22,
  height: 21,
  color: 'white',
};

CalendarWithBgSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
