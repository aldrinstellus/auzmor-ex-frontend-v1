import React from 'react';
import PropTypes from 'prop-types';

export const UserLockSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8.75 11.75a5.627 5.627 0 005.625-5.625A5.627 5.627 0 008.75.5a5.627 5.627 0 00-5.625 5.625A5.627 5.627 0 008.75 11.75zm0-1.875C6.68 9.875 5 8.195 5 6.125c0-2.07 1.68-3.75 3.75-3.75 2.07 0 3.75 1.68 3.75 3.75a3.76 3.76 0 01-3.75 3.75zm15 10.625c.69 0 1.25-.56 1.25-1.25V13c0-.69-.56-1.25-1.25-1.25H22.5V9.875a3.126 3.126 0 00-6.25 0v1.875H15c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h8.75zm-3.125-8.75h-2.5V9.875a1.25 1.25 0 012.5 0v1.875zm-8.484 8.75c-.309-.703-.266-1.2-.266-1.875h-10v-1A3.385 3.385 0 015.25 14.25c.57 0 1.496.625 3.5.625 1.652 0 2.715-.457 3.125-.563V13c.001-.164.027-.429.059-.59-1.024.113-1.563.59-3.184.59-1.84 0-2.375-.625-3.5-.625A5.254 5.254 0 000 17.625v1C0 19.66.84 20.5 1.875 20.5h10.266zm10.984-1.875h-7.5v-5h7.5v5zm-3.75-1.25a1.25 1.25 0 10-.001-2.5 1.25 1.25 0 00.001 2.5z"
        fill={props.color}
        fillRule="nonzero"
      />
    </svg>
  </React.Fragment>
);

UserLockSVG.defaultProps = {
  width: 26,
  height: 20,
  color: '#FF3366',
};

UserLockSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
