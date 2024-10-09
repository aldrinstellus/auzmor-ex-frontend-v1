import React from 'react';
import PropTypes from 'prop-types';

export const FailedTrainingSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="11" r="8" fill="#E02C42" />
    <path d="M11 21C5.47715 21 1 16.5228 1 11C1 5.47715 5.47715 1 11 1C16.5228 1 21 5.47715 21 11C21 13.7974 19.8514 16.3265 18 18.1414" stroke="#231F20" strokeLinecap="round" />
    <circle r="1" transform="matrix(1 0 0 -1 7 9)" fill="#231F20" />
    <circle r="1" transform="matrix(1 0 0 -1 16 9)" fill="#231F20" />
    <path d="M7 15C8.22222 13.4908 11.5333 11.3778 15 15" stroke="#231F20" strokeLinecap="round" />
  </svg>
);


FailedTrainingSVG.defaultProps = {
  width: 27,
  height: 27,
};

FailedTrainingSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
