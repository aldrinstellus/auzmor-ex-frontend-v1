import PropTypes from 'prop-types';
import React from 'react';

export const MentorshipUpdateSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="10.5" r="9.5" fill="#12B44D" stroke={props.color} strokeWidth="1.25" />
      <g clipPath="url(#clip0_1_4)">
        <path d="M11 5.91406C11.8892 5.9139 12.7593 6.17242 13.5042 6.6581C14.2491 7.14379 14.8366 7.83567 15.1951 8.64941C15.5536 9.46316 15.6677 10.3636 15.5234 11.2411C15.3791 12.1185 14.9827 12.9351 14.3825 13.5911" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 8.66406V12.3307" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12.8385 10.5H9.17188" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.65104 9.07031C6.50499 9.51428 6.42771 9.97798 6.42188 10.4453" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.79688 12.3359C7.05423 12.928 7.43377 13.4591 7.91063 13.8943" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.625 7.4006C7.75289 7.26138 7.88928 7.1302 8.03337 7.00781" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.46094 14.8148C10.6039 15.222 11.8616 15.1593 12.9585 14.6406" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_1_4">
          <rect width="11" height="11" fill={props.color} transform="translate(5.5 5)" />
        </clipPath>
      </defs>
    </svg>
  </React.Fragment>

);

MentorshipUpdateSVG.defaultProps = {
  width: 22,
  height: 21,
  color: 'white',
};

MentorshipUpdateSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
