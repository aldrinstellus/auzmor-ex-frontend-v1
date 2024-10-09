import PropTypes from 'prop-types';
import React from 'react';

export const GroupMemberSVG = props => (
  <React.Fragment>
    <svg
      height={props.height}
      width={props.width}
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 20C15.2467 20 19.5 15.7467 19.5 10.5C19.5 5.25329 15.2467 1 10 1C4.75329 1 0.5 5.25329 0.5 10.5C0.5 15.7467 4.75329 20 10 20Z"
        fill="#12B44D"
        stroke={props.color}
      />
      <path
        d="M13.5 14.5C13.5 13.4391 13.0786 12.4217 12.3284 11.6716C11.5783 10.9214 10.5609 10.5 9.5 10.5C8.43913 10.5 7.42172 10.9214 6.67157 11.6716C5.92143 12.4217 5.5 13.4391 5.5 14.5"
        stroke={props.color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 10.5C10.8807 10.5 12 9.38071 12 8C12 6.61929 10.8807 5.5 9.5 5.5C8.11929 5.5 7 6.61929 7 8C7 9.38071 8.11929 10.5 9.5 10.5Z"
        stroke={props.color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.4984 14.0016C15.4984 12.3166 14.4984 10.7516 13.4984 10.0016C13.8271 9.75495 14.09 9.43111 14.2637 9.0587C14.4374 8.68629 14.5167 8.2768 14.4944 7.86646C14.4722 7.45613 14.3491 7.05761 14.1362 6.70616C13.9232 6.35472 13.6269 6.06119 13.2734 5.85156"
        stroke={props.color}
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </React.Fragment>
);

GroupMemberSVG.defaultProps = {
  width: 20,
  height: 21,
  color: 'white',
};

GroupMemberSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
