import PropTypes from 'prop-types';
import React from 'react';

export const CompletedNotificationSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 52 52" fill="none" {...props}>
      <path d="M26 50C39.2548 50 50 39.2548 50 26C50 12.7452 39.2548 2 26 2C12.7452 2 2 12.7452 2 26C2 39.2548 12.7452 50 26 50Z" fill={props.color} stroke="white" strokeWidth="2.4" />
      <g filter="url(#filter0_d)">
        <path d="M16.4004 25.0051L22.6528 30.8L35.6004 18.8" stroke="white" strokeWidth="4.8" />
      </g>
      <defs>
        <filter x="4.76953" y="7.03973" width="42.4628" height="37.0325" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
          <feOffset />
          <feGaussianBlur stdDeviation={5} />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.127831 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  </React.Fragment>
);

CompletedNotificationSVG.defaultProps = {
  width: 52,
  height: 52,
  color: '#119B43',
};

CompletedNotificationSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
