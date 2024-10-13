import React from 'react';
import PropTypes from 'prop-types';

export const ReplyNotificationIconSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="11" r="10.5" fill={props.color} />
      <path d="M10 8.50109V6.37512C10 6.22462 9.9095 6.08862 9.771 6.02962C9.633 5.97112 9.4715 6.00062 9.364 6.10612L5.114 10.2311C5.041 10.3016 5 10.3986 5 10.5001C5 10.6016 5.041 10.6986 5.114 10.7691L9.364 14.894C9.4725 14.999 9.6335 15.0285 9.771 14.9705C9.9095 14.9115 10 14.7755 10 14.625V12.5H10.709C13.027 12.5 15.164 13.76 16.2855 15.786L16.296 15.805C16.363 15.927 16.49 16 16.625 16C16.656 16 16.687 15.9965 16.718 15.9885C16.884 15.946 17 15.7965 17 15.625C17 11.7381 13.8715 8.56809 10 8.50109Z" fill={props.iconColor} />
    </svg>


  </React.Fragment>
);

ReplyNotificationIconSVG.defaultProps = {
  width: 22,
  height: 22,
  color: 'black',
  iconColor: 'white',
};

ReplyNotificationIconSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  iconColor: PropTypes.string,
};
