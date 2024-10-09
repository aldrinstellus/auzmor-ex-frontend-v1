import React from 'react';
import PropTypes from 'prop-types';

export const RightArrowSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M1 6.5H13.2325" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8.41995 1.21045L13.7979 6.58835L8.41995 11.9663" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

RightArrowSVG.defaultProps = {
  width: 15,
  height: 13,
  color: '#5C5C5C',
};

RightArrowSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
