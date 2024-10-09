import PropTypes from 'prop-types';
import React from 'react';

export const LinkSVG = (props) => {
  const uniqueId = `clip0_${Math.random().toString(36).substr(2, 9)}`;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.width}
      height={props.height}
      viewBox="0 0 16 16"
      fill="none"
    >
      <g clipPath={`url(#${uniqueId})`}>
        <path
          d="M6.66663 8.66666C6.95293 9.04942 7.3182 9.36612 7.73766 9.59529C8.15712 9.82446 8.62096 9.96074 9.09773 9.99489C9.57449 10.029 10.053 9.96024 10.5009 9.79318C10.9487 9.62613 11.3554 9.36471 11.6933 9.02666L13.6933 7.02666C14.3005 6.39799 14.6365 5.55598 14.6289 4.68199C14.6213 3.808 14.2707 2.97196 13.6527 2.35394C13.0347 1.73591 12.1986 1.38535 11.3246 1.37775C10.4506 1.37016 9.60863 1.70614 8.97996 2.31333L7.83329 3.45333"
          stroke={props.color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.33334 7.33334C9.04704 6.95058 8.68177 6.63388 8.26231 6.40471C7.84285 6.17554 7.37901 6.03926 6.90224 6.00511C6.42548 5.97097 5.94695 6.03976 5.49911 6.20681C5.05127 6.37387 4.6446 6.63529 4.30668 6.97334L2.30668 8.97334C1.69948 9.60201 1.3635 10.444 1.3711 11.318C1.37869 12.192 1.72926 13.028 2.34728 13.6461C2.96531 14.2641 3.80135 14.6147 4.67534 14.6222C5.54933 14.6298 6.39134 14.2939 7.02001 13.6867L8.16001 12.5467"
          stroke={props.color}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id={uniqueId}>
          <rect width={props.width} height={props.height} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

LinkSVG.defaultProps = {
  width: 16,
  height: 16,
  color: '#FF3366',
};

LinkSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
