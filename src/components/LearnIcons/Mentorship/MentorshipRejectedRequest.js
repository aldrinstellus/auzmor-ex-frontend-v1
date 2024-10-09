import PropTypes from 'prop-types';
import React from 'react';

export const MentorshipRejectedRequestSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="10.5" r="9.5" fill="#FF0000" stroke={props.color} strokeWidth="1.25" />
      <path d="M10.1101 5.65756L7.35094 7.45881C6.46635 8.03631 6.46635 9.32881 7.35094 9.90631L10.1101 11.7076C10.6051 12.033 11.4209 12.033 11.9159 11.7076L14.6614 9.90631C15.5414 9.32881 15.5414 8.04089 14.6614 7.46339L11.9159 5.66214C11.4209 5.33214 10.6051 5.33214 10.1101 5.65756Z" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.08271 10.4922L8.07812 12.6418C8.07812 13.2239 8.52729 13.8472 9.07729 14.0305L10.5394 14.5164C10.7915 14.5989 11.2085 14.5989 11.4652 14.5164L12.9273 14.0305C13.4773 13.8472 13.9265 13.2239 13.9265 12.6418V10.5151" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>


  </React.Fragment>
);

MentorshipRejectedRequestSVG.defaultProps = {
  width: 22,
  height: 21,
  color: 'white',
};

MentorshipRejectedRequestSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
