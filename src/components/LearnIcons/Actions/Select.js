import React from 'react';
import PropTypes from 'prop-types';

export const SelectSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M1 4.40077L5.59923 9L13.5992 1" stroke={props.color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

SelectSVG.defaultProps = {
  width: 15,
  height: 10,
  color: 'white',
};

SelectSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
