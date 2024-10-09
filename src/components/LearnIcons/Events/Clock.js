import React from 'react';
import PropTypes from 'prop-types';

export const ClockSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" fillRule="evenodd">
        <path d="M-4-4h24v24H-4z" />
        <path
          d="M7.75 15.5a7.749 7.749 0 007.75-7.75A7.749 7.749 0 007.75 0 7.749 7.749 0 000 7.75a7.749 7.749 0 007.75 7.75zm0-1A6.75 6.75 0 011 7.75 6.75 6.75 0 017.75 1a6.75 6.75 0 016.75 6.75 6.75 6.75 0 01-6.75 6.75zm2.622-4.072l.256-.353a.375.375 0 00-.081-.525L8.344 7.947V3.375A.376.376 0 007.969 3H7.53a.376.376 0 00-.375.375v4.987c0 .12.056.232.153.304l2.538 1.843a.378.378 0 00.525-.08z"
          fill={props.color}
          fillRule="nonzero"
        />
      </g>
    </svg>
  </React.Fragment>
);

ClockSVG.defaultProps = {
  width: 15,
  height: 16,
  color: '#666666',
};

ClockSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
