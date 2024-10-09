import PropTypes from 'prop-types';
import React from 'react';

export const SelectionSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 25 25" {...props}>
      <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd" fillOpacity="0.105701" opacity="0.6">
        <g transform="translate(-1078.000000, -73.000000)" fill="#000000" fillRule="nonzero" stroke={props.color}>
          <circle cx="1090.5" cy="85.5" r={12} />
        </g>
      </g>
    </svg>
  </React.Fragment>
);

SelectionSVG.defaultProps = {
  width: 25,
  height: 25,
  color: '#FFFFFF',
};

SelectionSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
