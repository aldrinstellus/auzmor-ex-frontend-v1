import PropTypes from 'prop-types';
import React from 'react';

export const EmailSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd" opacity="0.899881">
        <g transform="translate(-912.000000, -326.000000)" fill={props.color} fillRule="nonzero">
          <g transform="translate(405.000000, 173.000000)">
            <g transform="translate(507.000000, 151.000000)">
              <g transform="translate(0.000000, 2.000000)">
                <path d="M14.59375,0 L1.40625,0 C0.6318125,0 0,0.631125 0,1.40625 L0,10.78125 C0,11.55375 0.629,12.1875 1.40625,12.1875 L14.59375,12.1875 C15.36625,12.1875 16,11.5585 16,10.78125 L16,1.40625 C16,0.63375 15.371,0 14.59375,0 Z M14.3995625,0.9375 L8.0298125,7.30728125 L1.60496875,0.9375 L14.3995625,0.9375 Z M0.9375,10.587125 L0.9375,1.59590625 L5.45246875,6.07215625 L0.9375,10.587125 Z M1.60040625,11.25 L6.11821875,6.7321875 L7.70125,8.301625 C7.8845,8.4833125 8.18021875,8.48271875 8.36271875,8.3001875 L9.90625,6.75665625 L14.3995937,11.25 L1.60040625,11.25 Z M15.0625,10.5870937 L10.5691563,6.09375 L15.0625,1.600375 L15.0625,10.5870937 Z" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  </React.Fragment>
);

EmailSVG.defaultProps = {
  width: 26,
  height: 20,
  color: '#FF3366',
};

EmailSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
