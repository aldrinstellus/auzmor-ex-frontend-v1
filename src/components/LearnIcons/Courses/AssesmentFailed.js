import React from 'react';
import PropTypes from 'prop-types';

export const AssesmentFailedSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 26 26" fill="none" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M13 26C20.1797 26 26 20.1797 26 13C26 5.8203 20.1797 0 13 0C5.8203 0 0 5.8203 0 13C0 20.1797 5.8203 26 13 26Z" fill={props.color} />
      <path d="M8.65 8.65L16.5646 16.5646" stroke="white" strokeWidth="2.08" />
      <path d="M16.4496 8.65L8.53504 16.5646" stroke="white" strokeWidth="2.08" />
    </svg>
  </React.Fragment>
);

AssesmentFailedSVG.defaultProps = {
  width: 26,
  height: 26,
  color: '#EA3535',
};

AssesmentFailedSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
