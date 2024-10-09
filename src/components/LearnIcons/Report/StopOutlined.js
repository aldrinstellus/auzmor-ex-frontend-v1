import PropTypes from 'prop-types';
import React from 'react';

export const StopSVG = props => (
  <svg
    width={props.width}
    height={props.height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.8084 10.0001C17.8084 14.3263 14.3013 17.8334 9.97506 17.8334C5.64883 17.8334 2.14172 14.3263 2.14172 10.0001C2.14172 5.67385 5.64883 2.16675 9.97506 2.16675C14.3013 2.16675 17.8084 5.67385 17.8084 10.0001Z"
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.0583 11.5251H8.94164C8.73912 11.5251 8.59773 11.5115 8.50386 11.4962C8.48859 11.4023 8.47498 11.261 8.47498 11.0584V8.94176C8.47498 8.73973 8.4883 8.59814 8.50339 8.5036C8.59787 8.48848 8.73948 8.4751 8.94164 8.4751H11.0583C11.2603 8.4751 11.4019 8.48842 11.4965 8.50351C11.5116 8.59799 11.525 8.73961 11.525 8.94176V11.0584C11.525 11.2605 11.5117 11.4021 11.4966 11.4966C11.4021 11.5117 11.2605 11.5251 11.0583 11.5251Z"
      stroke={props.color}
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

StopSVG.defaultProps = {
  width: 20,
  height: 20,
  color: '#FFF',
};

StopSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
