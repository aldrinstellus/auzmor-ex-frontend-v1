import PropTypes from 'prop-types';
import React from 'react';

export const AddMemberWithBgSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 20C15.2467 20 19.5 15.7467 19.5 10.5C19.5 5.25329 15.2467 1 10 1C4.75329 1 0.5 5.25329 0.5 10.5C0.5 15.7467 4.75329 20 10 20Z" fill="#12B44D" stroke={props.color} />
      <path d="M5.5 14.5002C5.49996 13.7304 5.72207 12.9769 6.13967 12.3302C6.55728 11.6834 7.15264 11.171 7.8543 10.8542C8.55596 10.5375 9.33412 10.43 10.0954 10.5446C10.8566 10.6591 11.5687 10.991 12.146 11.5002" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 10.5C10.8807 10.5 12 9.38071 12 8C12 6.61929 10.8807 5.5 9.5 5.5C8.11929 5.5 7 6.61929 7 8C7 9.38071 8.11929 10.5 9.5 10.5Z" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 12V15" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.5 13.5H12.5" stroke={props.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>

  </React.Fragment>
);

AddMemberWithBgSVG.defaultProps = {
  width: 20,
  height: 21,
  color: 'white',
};

AddMemberWithBgSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
