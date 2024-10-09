import React from 'react';
import PropTypes from 'prop-types';

export const CircleBackSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="13.5" cy="13.5" r="13" stroke={props.color} />
      <path d="M15 16L12 13L15 10" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

CircleBackSVG.defaultProps = {
  width: 27,
  height: 27,
  color: '#000',
};

CircleBackSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
