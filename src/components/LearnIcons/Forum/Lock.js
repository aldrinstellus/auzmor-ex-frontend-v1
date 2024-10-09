import React from 'react';
import PropTypes from 'prop-types';

export const LockSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M19 11.5H5C3.89543 11.5 3 12.3954 3 13.5V20.5C3 21.6046 3.89543 22.5 5 22.5H19C20.1046 22.5 21 21.6046 21 20.5V13.5C21 12.3954 20.1046 11.5 19 11.5Z" stroke={props.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 11.5V7.5C7 6.17392 7.52678 4.90215 8.46447 3.96447C9.40215 3.02678 10.6739 2.5 12 2.5C13.3261 2.5 14.5979 3.02678 15.5355 3.96447C16.4732 4.90215 17 6.17392 17 7.5V11.5" stroke={props.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

LockSVG.defaultProps = {
  width: 20,
  height: 20,
  color: 'white',
};

LockSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
