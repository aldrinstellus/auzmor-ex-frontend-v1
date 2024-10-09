import React from 'react';
import PropTypes from 'prop-types';

export const UserShieldSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8.75 11.75a5.626 5.626 0 005.625-5.625A5.626 5.626 0 008.75.5a5.626 5.626 0 00-5.625 5.625A5.626 5.626 0 008.75 11.75zm0-1.875A3.756 3.756 0 015 6.125a3.756 3.756 0 013.75-3.75 3.756 3.756 0 013.75 3.75 3.756 3.756 0 01-3.75 3.75zm11.059 10.543c2.003-.781 5.19-3.492 5.19-8.355 0-.426-.272-.81-.69-.973l-4.5-1.758a1.21 1.21 0 00-.868 0l-4.5 1.758c-.418.164-.691.547-.691.973 0 4.359 2.684 7.374 5.191 8.355.375.144.703.062.868 0zm-.434-1.855v-7.387l3.73 1.457c-.218 3.402-2.379 5.289-3.73 5.93zM15.598 20.5a10.853 10.853 0 01-1.684-1.875H1.875v-1A3.38 3.38 0 015.25 14.25c.57 0 1.496.625 3.5.625 1.84 0 2.77-.527 3.336-.605-.113-.594-.18-1.211-.2-1.856-1 .125-1.542.586-3.14.586-1.84 0-2.375-.625-3.5-.625A5.25 5.25 0 000 17.625v1C0 19.66.84 20.5 1.875 20.5h13.723z"
        fill={props.color}
        fillRule="nonzero"
      />
    </svg>
  </React.Fragment>
);

UserShieldSVG.defaultProps = {
  width: 26,
  height: 20,
  color: '#FF3366',
};

UserShieldSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
