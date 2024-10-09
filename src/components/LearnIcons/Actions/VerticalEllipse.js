import React from 'react';
import PropTypes from 'prop-types';

export const VerticalEllipseSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 5 23" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5 20.5C5 19.1193 3.88071 18 2.5 18C1.11929 18 0 19.1193 0 20.5C0 21.8807 1.11929 23 2.5 23C3.88071 23 5 21.8807 5 20.5Z" fill={props.color} />
      <path d="M5 11.5C5 10.1193 3.88071 9 2.5 9C1.11929 9 0 10.1193 0 11.5C0 12.8807 1.11929 14 2.5 14C3.88071 14 5 12.8807 5 11.5Z" fill={props.color} />
      <path d="M5 2.5C5 1.11929 3.88071 0 2.5 0C1.11929 0 0 1.11929 0 2.5C0 3.88071 1.11929 5 2.5 5C3.88071 5 5 3.88071 5 2.5Z" fill={props.color} />
    </svg>
  </React.Fragment>
);

VerticalEllipseSVG.defaultProps = {
  width: 5,
  height: 23,
  color: '#9B9B9B',
};

VerticalEllipseSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
