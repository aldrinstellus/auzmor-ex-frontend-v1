import PropTypes from 'prop-types';
import React from 'react';

export const ModuleSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
      <g transform="translate(-263.000000, -811.000000)" stroke={props.color}>
        <g transform="translate(243.000000, 407.000000)">
          <g transform="translate(0.000000, 70.000000)">
            <g transform="translate(21.000000, 334.000000)">
              <g transform="translate(0.111111, 0.110345)" strokeWidth="1.3">
                <polygon points="8.58402222 0.51616 17.1572333 5.254 8.58402222 10.3628 0.0108111109 5.254" />
                <polyline points="2.15032222 8.05936 0.0108111109 9.3344 8.58402222 14.44312 17.1572333 9.3344 15.0176444 8.05936" />
                <polyline points="2.15032222 12.26824 0.0108111109 13.5432 8.58402222 18.65192 17.1572333 13.5432 15.0176444 12.26824" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

ModuleSVG.defaultProps = {
  width: 19,
  height: 20,
  color: '#FF3366',
};

ModuleSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
