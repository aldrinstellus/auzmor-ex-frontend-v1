import React from 'react';
import PropTypes from 'prop-types';

export const PresentationSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" fillRule="evenodd">
        <path d="M-3-4h24v24H-3z" />
        <path
          d="M11.646 16a.287.287 0 00.177-.073l.354-.355a.251.251 0 000-.354L9.5 12.534v-1.536H16c.552 0 1-.45 1-1.002V1.003h.75a.25.25 0 00.25-.25V.25A.25.25 0 0017.75 0H.25A.25.25 0 000 .25v.502c0 .138.112.25.25.25H1v8.994c0 .552.448 1.002 1 1.002h6.5v1.536l-2.677 2.684a.251.251 0 000 .354l.354.355c.04.04.12.073.176.073a.287.287 0 00.177-.073L9 13.45l2.47 2.477c.04.04.12.073.176.073zM16 10H2V1h14v9z"
          fill={props.color}
          fillRule="nonzero"
          opacity={0.67}
        />
      </g>
    </svg>
  </React.Fragment>
);

PresentationSVG.defaultProps = {
  width: 19,
  height: 16,
  color: '#000',
};

PresentationSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
