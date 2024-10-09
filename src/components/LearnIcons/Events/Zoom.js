import PropTypes from 'prop-types';
import React from 'react';

export const ZoomSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 28 28" version="1.1">
      <defs>
        <circle cx="14" cy="14" r="14" />
      </defs>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-383.000000, -583.000000)">
          <g transform="translate(45.000000, 547.000000)">
            <g transform="translate(323.000000, 25.000000)">
              <g transform="translate(15.000000, 11.000000)">
                <mask id="zoom-2" fill="white">
                  <use href="#zoom-1" />
                </mask>
                <use fill={props.color} href="#path-1" />
                <image mask="url(#zoom-2)" x="-1" y="-1" width="30" height="30" href="data:image/png;base64,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" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  </React.Fragment>
);

ZoomSVG.defaultProps = {
  width: 17,
  height: 20,
  color: '#D8D8D8',
};

ZoomSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
