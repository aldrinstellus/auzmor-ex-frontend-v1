import PropTypes from 'prop-types';
import React from 'react';

export const MentorshipNoteSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="10.5" r="9.5" fill="#12B44D" stroke={props.color} strokeWidth="1.25" />
      <path d="M15 8.625V13.5C15 15 14.105 15.5 13 15.5H9C7.895 15.5 7 15 7 13.5V8.625C7 7 7.895 6.625 9 6.625C9 6.935 9.12499 7.215 9.32999 7.42C9.53499 7.625 9.815 7.75 10.125 7.75H11.875C12.495 7.75 13 7.245 13 6.625C14.105 6.625 15 7 15 8.625Z" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 6.625C13 7.245 12.495 7.75 11.875 7.75H10.125C9.815 7.75 9.53499 7.625 9.32999 7.42C9.12499 7.215 9 6.935 9 6.625C9 6.005 9.505 5.5 10.125 5.5H11.875C12.185 5.5 12.465 5.625 12.67 5.83C12.875 6.035 13 6.315 13 6.625Z" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 11H11" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 13H13" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

MentorshipNoteSVG.defaultProps = {
  width: 48,
  height: 48,
  color: 'white',
};

MentorshipNoteSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
