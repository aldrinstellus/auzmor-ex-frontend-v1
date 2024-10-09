import React from 'react';
import PropTypes from 'prop-types';

export const AssesmentProgressSVG = (props) => (
  <svg
    height={props.height}
    width={props.width}
    viewBox="0 0 56 46"
    fill="none"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.87227e-05 12.4616C9.87227e-05 12.4616 -0.0995669 2.34668 6.03452 2.34668C12.1689 2.34668 11.4526 12.4042 11.4526 12.4042L9.87227e-05 12.4616Z"
      fill={props.color}
    />
    <path
      d="M6.98627 1.78886C6.57526 1.72379 39.2125 1.79008 39.2125 1.79008C39.2125 1.79008 45.0169 1.14335 44.5198 10.7791V36.3495"
      stroke="#231F20"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.971 44.8724C14.1791 44.3914 11.1738 42.9365 11.0299 38.5818V11.1804C11.0299 11.1804 11.6444 2.52645 6.98633 1.78882"
      stroke="#231F20"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <mask
      id="progress0"
      maskUnits="userSpaceOnUse"
      x={17}
      y={35}
      width={38}
      height={11}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.9512 35.0266H54.8152V45.853H17.9512V35.0266Z"
        fill="white"
      />
    </mask>
    <g mask="url(#progress0)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24.2933 35.0266H54.5862C54.5862 35.0266 56.756 45.8531 47.7373 45.8531H18.61C18.2309 45.8531 17.9512 45.4627 17.9512 45.1455C17.9512 44.8333 18.2231 44.473 18.5555 44.4356C18.9623 44.39 20.1836 44.3973 21.0507 44.064C23.7869 43.0132 24.5354 41.5781 24.2933 35.0266Z"
        fill={props.color}
      />
    </g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.1562 18.9656H24.292V9.73999H15.1562V18.9656Z"
      fill={props.color}
    />
    <path
      d="M17.4141 14.7943L18.5095 16.2954L22.0354 12.7681"
      stroke="#231F20"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.1562 31.9702H24.292V22.7446H15.1562V31.9702Z"
      fill={props.color}
    />
    <path
      d="M17.4141 27.7994L18.5095 29.3005L22.0354 25.7732"
      stroke="#231F20"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27.5684 12.0883H39.7986"
      stroke="#231F20"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27.5684 15.6159H33.3803"
      stroke="#231F20"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27.2656 24.9035H39.4959"
      stroke="#231F20"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M27.2656 28.4308H33.0775"
      stroke="#231F20"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

AssesmentProgressSVG.defaultProps = {
  width: 56,
  height: 46,
  color: '#2EE65B',
};

AssesmentProgressSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
