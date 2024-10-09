import React from 'react';
import PropTypes from 'prop-types';

export const CourseInviteSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 58 58" fill="none" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M29 57C44.464 57 57 44.464 57 29C57 13.536 44.464 1 29 1C13.536 1 1 13.536 1 29C1 44.464 13.536 57 29 57Z" stroke={props.color} strokeWidth="1.3" />
    <path fillRule="evenodd" clipRule="evenodd" d="M48 56C51.866 56 55 52.866 55 49C55 45.134 51.866 42 48 42C44.134 42 41 45.134 41 49C41 52.866 44.134 56 48 56Z" fill="white" stroke={props.color} strokeWidth="1.3" />
    <path d="M48 45L48 49.725L50 52" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

CourseInviteSVG.defaultProps = {
  width: 58,
  height: 58,
  color: '#F36',
};

CourseInviteSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
