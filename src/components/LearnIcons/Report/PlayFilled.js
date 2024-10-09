import React from 'react';
import PropTypes from 'prop-types';

export const PlayFilledSVG = props => (
  <svg width={props.width} height={props.height} {...props}>
    <g fill={props.color} fillRule="evenodd">
      <circle fillOpacity={0.1} cx={17.5} cy={17.5} r={17.5} />
      <path
        d="M14.98 24.567l9.625-5.688a1.311 1.311 0 000-2.258l-9.625-5.69c-.782-.463-1.98-.014-1.98 1.129v11.377a1.311 1.311 0 001.98 1.13zm-.668-1.417v-10.8c0-.126.14-.205.25-.143l9.138 5.4a.164.164 0 010 .282l-9.139 5.404a.166.166 0 01-.249-.143z"
        fillRule="nonzero"
      />
    </g>
  </svg>
);

PlayFilledSVG.defaultProps = {
  width: 16,
  height: 16,
  color: '#F36',
};

PlayFilledSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
