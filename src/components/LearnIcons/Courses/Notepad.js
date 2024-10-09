import PropTypes from 'prop-types';
import React from 'react';


export function NotepadSVG(props) {
  return (
    <svg width={14} height={17} viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12.8031 4.04062C12.8031 3.22425 12.094 2.5625 11.2193 2.5625H3.00303C2.12827 2.5625 1.41919 3.22431 1.41919 4.04062V14.2093C1.41919 15.0256 2.12834 15.6874 3.00303 15.6874H11.2192C12.094 15.6874 12.8031 15.0256 12.8031 14.2093V4.04062H12.8031Z" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.0788 6.3125H4.10107" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.0788 8.8125H4.10107" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.0788 11.3125H4.10107" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.11121 1.31934V3.18959" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.10217 1.31934V3.18959" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.12024 1.31934V3.18959" stroke={props.color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

NotepadSVG.propTypes = {
  color: PropTypes.string,
};

NotepadSVG.defaultProps = {
  color: '#FF3366',
};
