import React from 'react';
import PropTypes from 'prop-types';

export const DescriptionIconSVG = props => (
  <svg
    width={props.width}
    height={props.height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M11.3333 6.66667H2" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 4H2" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 9.33333H2" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.3333 12H2" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

DescriptionIconSVG.defaultProps = {
  width: 16,
  height: 16,
  color: '"#FF3366"',
};

DescriptionIconSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
