import React from 'react';
import PropTypes from 'prop-types';

export const CircleCheckOutlineSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.6667 7.88662V8.49995C14.6659 9.93757 14.2004 11.3364 13.3396 12.4878C12.4788 13.6393 11.2689 14.4816 9.89028 14.8892C8.51166 15.2968 7.03821 15.2479 5.68969 14.7497C4.34116 14.2515 3.18981 13.3307 2.40735 12.1247C1.62488 10.9186 1.25323 9.49199 1.34783 8.05749C1.44242 6.62299 1.99818 5.2575 2.93223 4.16467C3.86628 3.07183 5.12856 2.31021 6.53083 1.99338C7.9331 1.67656 9.40022 1.82151 10.7134 2.40662" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14.6667 3.16663L8 9.83996L6 7.83996" stroke={props.color} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

CircleCheckOutlineSVG.defaultProps = {
  width: 16,
  height: 17,
  color: '#FF3366',
};

CircleCheckOutlineSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
