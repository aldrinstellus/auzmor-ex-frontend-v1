import PropTypes from 'prop-types';
import React from 'react';

export const MoreActionSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 23 5" {...props}>
      <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd" opacity="0.7">
        <g transform="translate(-995.000000, -78.000000)" fill={props.color} fillRule="nonzero">
          <g transform="translate(995.000000, 78.000000)">
            <circle cx="2.5" cy="2.5" r="2.5" />
            <circle cx="11.5" cy="2.5" r="2.5" />
            <circle cx="20.5" cy="2.5" r="2.5" />
          </g>
        </g>
      </g>
    </svg>
  </React.Fragment>
);

MoreActionSVG.defaultProps = {
  width: 23,
  height: 5,
  color: '#FFFFFF',
};

MoreActionSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
