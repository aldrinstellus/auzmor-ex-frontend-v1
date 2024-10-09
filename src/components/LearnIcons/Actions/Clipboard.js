import React from 'react';
import PropTypes from 'prop-types';

export const ClipboardSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M10.0002 1.33337H6.00016C5.63197 1.33337 5.3335 1.63185 5.3335 2.00004V3.33337C5.3335 3.70156 5.63197 4.00004 6.00016 4.00004H10.0002C10.3684 4.00004 10.6668 3.70156 10.6668 3.33337V2.00004C10.6668 1.63185 10.3684 1.33337 10.0002 1.33337Z" stroke="#737373" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.6665 2.66663H11.9998C12.3535 2.66663 12.6926 2.8071 12.9426 3.05715C13.1927 3.3072 13.3332 3.64634 13.3332 3.99996V13.3333C13.3332 13.6869 13.1927 14.0261 12.9426 14.2761C12.6926 14.5262 12.3535 14.6666 11.9998 14.6666H3.99984C3.64622 14.6666 3.30708 14.5262 3.05703 14.2761C2.80698 14.0261 2.6665 13.6869 2.6665 13.3333V3.99996C2.6665 3.64634 2.80698 3.3072 3.05703 3.05715C3.30708 2.8071 3.64622 2.66663 3.99984 2.66663H5.33317" stroke="#737373" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

ClipboardSVG.defaultProps = {
  width: 16,
  height: 16,
  color: '#737373',
};

ClipboardSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
