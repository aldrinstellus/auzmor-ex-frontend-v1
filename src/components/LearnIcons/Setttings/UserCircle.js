import React from 'react';
import PropTypes from 'prop-types';

export const UserCircleSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M9.687 20.187a9.686 9.686 0 009.688-9.687A9.686 9.686 0 009.687.813 9.686 9.686 0 000 10.5a9.686 9.686 0 009.687 9.687zm6.356-5.16C15.09 13.801 13.617 13 11.937 13c-.398 0-1.015.375-2.25.375-1.23 0-1.851-.375-2.25-.375-1.675 0-3.148.8-4.105 2.027A7.757 7.757 0 011.875 10.5c0-4.309 3.504-7.812 7.812-7.812 4.31 0 7.813 3.503 7.813 7.812 0 1.688-.543 3.25-1.457 4.527zm-6.356-2.964a3.751 3.751 0 000-7.5 3.751 3.751 0 000 7.5zm0-1.875a1.875 1.875 0 11.001-3.751 1.875 1.875 0 010 3.75zm0 8.124a7.768 7.768 0 01-5.082-1.89 3.365 3.365 0 012.72-1.543c.812.25 1.585.375 2.362.375.778 0 1.551-.121 2.364-.375 1.14.039 2.136.644 2.718 1.543a7.768 7.768 0 01-5.082 1.89z"
        fill={props.color}
        fillRule="nonzero"
      />
    </svg>
  </React.Fragment>
);

UserCircleSVG.defaultProps = {
  width: 26,
  height: 20,
  color: '#FF3366',
};

UserCircleSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
