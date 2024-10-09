import React from 'react';
import PropTypes from 'prop-types';

export const SortIconSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M15.4702 17.5059C13.5397 17.5059 11.6113 17.507 9.68073 17.5059C8.74539 17.5048 7.94153 16.8164 7.83036 15.9239C7.6978 14.8773 8.25687 13.9997 9.21359 13.7592C9.35897 13.7229 9.5129 13.7047 9.66149 13.7047C13.5386 13.7015 17.4147 13.7015 21.2907 13.7025C22.3479 13.7036 23.1443 14.531 23.1433 15.6192C23.1422 16.6775 22.3341 17.5048 21.2929 17.5059C19.3527 17.507 17.4104 17.5059 15.4702 17.5059Z" fill={props.color} />
    <path fillRule="evenodd" clipRule="evenodd" d="M15.4705 10.6688C13.5399 10.6688 11.6115 10.6699 9.68098 10.6677C8.77129 10.6667 8.02836 10.0552 7.84557 9.16691C7.59329 7.94402 8.46557 6.86543 9.71305 6.86543C13.5677 6.86436 17.4203 6.86329 21.275 6.86543C22.2445 6.86543 23.0184 7.55384 23.135 8.51163C23.2568 9.50898 22.6625 10.3941 21.709 10.6164C21.5518 10.6528 21.3872 10.6667 21.2258 10.6667C19.307 10.6699 17.3893 10.6688 15.4705 10.6688Z" fill={props.color} />
    <path fillRule="evenodd" clipRule="evenodd" d="M15.4704 0.0246203C17.3999 0.0246203 19.3294 0.0235513 21.2589 0.0256892C22.1525 0.0267582 22.872 0.58155 23.0879 1.42603C23.4064 2.67031 22.5299 3.82692 21.2578 3.82799C17.4042 3.8312 13.5495 3.83013 9.69697 3.82799C8.72635 3.82692 7.92356 3.11713 7.82522 2.20958C7.68412 0.92255 8.53822 0.188172 9.33032 0.0534823C9.47249 0.0288961 9.62001 0.0256892 9.76539 0.0256892C11.6671 0.0246203 13.5688 0.0246203 15.4704 0.0246203Z" fill={props.color} />
    <mask id="mask0_2345_1142" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="6" height="18">
      <path fillRule="evenodd" clipRule="evenodd" d="M0 0H5.19709V17.4957H0V0Z" fill="white" />
    </mask>
    <g mask="url(#mask0_2345_1142)">
      <path fillRule="evenodd" clipRule="evenodd" d="M2.44341 0H5.19706V17.4957C3.46747 16.2226 1.75499 14.9634 -0.000244141 13.672H2.44341V0Z" fill={props.color} />
    </g>
  </svg>
);

SortIconSVG.defaultProps = {
  width: 24,
  height: 18,
  color: '#5C5C5C',
};

SortIconSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
