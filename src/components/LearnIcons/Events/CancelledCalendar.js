import React from 'react';
import PropTypes from 'prop-types';

export const CancelledCalendar = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12.6667 2.66663H3.33333C2.59695 2.66663 2 3.26358 2 3.99996V13.3333C2 14.0697 2.59695 14.6666 3.33333 14.6666H12.6667C13.403 14.6666 14 14.0697 14 13.3333V3.99996C14 3.26358 13.403 2.66663 12.6667 2.66663Z" stroke="#E68201" strokeWidth="0.666667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.6667 1.33337V4.00004" stroke="#E68201" strokeWidth="0.666667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.33325 1.33337V4.00004" stroke="#E68201" strokeWidth="0.666667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 6.66663H14" stroke="#E68201" strokeWidth="0.666667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.66675 9.33337L9.33341 12" stroke="#E68201" strokeWidth="0.666667" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.33341 9.33337L6.66675 12" stroke="#E68201" strokeWidth="0.666667" strokeLinecap="round" strokeLinejoin="round" />

  </svg>
);

CancelledCalendar.defaultProps = {
  width: 16,
  height: 16,
  color: '#E68201',
};

CancelledCalendar.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
