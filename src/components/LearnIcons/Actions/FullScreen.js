import React from 'react';

export function FullScreenSVG(props) {
  return (
    <svg width={23} height={23} viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g opacity="0.4">
        <path d="M9.55669 13.0161L4.41083 18.162" stroke="black" strokeWidth={2} strokeLinecap="round" />
        <path d="M3.32784 13.0804L3.32784 19.3317L9.57923 19.3317" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.0166 9.55714L18.1624 4.41129" stroke="black" strokeWidth={2} strokeLinecap="round" />
        <path d="M19.2454 9.49288L19.2454 3.24149L12.994 3.24149" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}
