import React from 'react';
import PropTypes from 'prop-types';

export const AddMemberOutlineSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M9.33325 12.75V11.5833C9.33325 10.9645 9.08742 10.371 8.64983 9.93342C8.21225 9.49583 7.61876 9.25 6.99992 9.25H2.91659C2.29775 9.25 1.70425 9.49583 1.26667 9.93342C0.829085 10.371 0.583252 10.9645 0.583252 11.5833V12.75" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.95833 6.91667C6.247 6.91667 7.29167 5.872 7.29167 4.58333C7.29167 3.29467 6.247 2.25 4.95833 2.25C3.66967 2.25 2.625 3.29467 2.625 4.58333C2.625 5.872 3.66967 6.91667 4.95833 6.91667Z" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.6667 5.16663V8.66663" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.4167 6.91663H9.91675" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

AddMemberOutlineSVG.defaultProps = {
  width: 20,
  height: 16,
  color: '#101010',
};

AddMemberOutlineSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
