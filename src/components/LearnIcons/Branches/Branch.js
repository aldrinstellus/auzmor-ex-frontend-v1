import React from 'react';
import PropTypes from 'prop-types';

export const BranchSVG = props => (
  <svg
    width={props.width}
    height={props.height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 2V10"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 6C13.1046 6 14 5.10457 14 4C14 2.89543 13.1046 2 12 2C10.8954 2 10 2.89543 10 4C10 5.10457 10.8954 6 12 6Z"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 14C5.10457 14 6 13.1046 6 12C6 10.8954 5.10457 10 4 10C2.89543 10 2 10.8954 2 12C2 13.1046 2.89543 14 4 14Z"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 6C12 7.5913 11.3679 9.11742 10.2426 10.2426C9.11742 11.3679 7.5913 12 6 12"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

BranchSVG.defaultProps = {
  width: '15',
  height: '16',
  color: '#FF3366',
};

BranchSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
