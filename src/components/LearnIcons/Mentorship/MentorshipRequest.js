import PropTypes from 'prop-types';
import React from 'react';

export const MentorshipRequestSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="11" cy="10.5" r="9.5" fill="#12B44D" stroke={props.color} strokeWidth="1.25" />
      <path d="M10.0228 5.76563L7.01281 7.73063C6.04781 8.36063 6.04781 9.77063 7.01281 10.4006L10.0228 12.3656C10.5628 12.7206 11.4528 12.7206 11.9928 12.3656L14.9878 10.4006C15.9478 9.77063 15.9478 8.36563 14.9878 7.73563L11.9928 5.77063C11.4528 5.41063 10.5628 5.41063 10.0228 5.76563Z" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.8175 11.0391L7.8125 13.3841C7.8125 14.0191 8.3025 14.6991 8.9025 14.8991L10.4975 15.4291C10.7725 15.5191 11.2275 15.5191 11.5075 15.4291L13.1025 14.8991C13.7025 14.6991 14.1925 14.0191 14.1925 13.3841V11.0641" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

MentorshipRequestSVG.defaultProps = {
  width: 22,
  height: 21,
  color: 'white',
};

MentorshipRequestSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
