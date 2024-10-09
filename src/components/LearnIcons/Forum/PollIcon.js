import React from 'react';
import PropTypes from 'prop-types';

export const PollIconSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4.375 -1.91237e-07L8.75 -3.82475e-07L8.75 5.25L12.25 5.25L12.25 13.125L13.125 13.125L13.125 14L0 14L-3.82475e-08 13.125L0.875 13.125L0.875 3.5L4.375 3.5L4.375 -1.91237e-07ZM1.75 13.125L4.375 13.125L4.375 4.375L1.75 4.375L1.75 13.125ZM11.375 6.125L8.75 6.125L8.75 13.125L11.375 13.125L11.375 6.125ZM7.875 0.875L5.25 0.875L5.25 13.125L7.875 13.125L7.875 0.875Z" fill={props.color} />
  </svg>
);

PollIconSVG.defaultProps = {
  width: 14,
  height: 14,
  color: '#FF3366',
};

PollIconSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
