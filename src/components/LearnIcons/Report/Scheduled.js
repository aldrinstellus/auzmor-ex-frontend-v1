import React from 'react';
import PropTypes from 'prop-types';

export const ScheduledSVG = props => (
  <svg width={props.width} height={props.height} {...props}>
    <g fill="none" fillRule="evenodd">
      <circle fillOpacity={0.1} fill={props.color} cx={17.5} cy={17.5} r={17.5} />
      <path
        d="M21.937 24.75c.725 0 1.313-.588 1.313-1.313v-9.624c0-.725-.588-1.313-1.313-1.313h-1.312v-1.422a.328.328 0 00-.328-.328h-1.094a.328.328 0 00-.328.328V12.5h-3.5v-1.422a.328.328 0 00-.328-.328h-1.094a.328.328 0 00-.328.328V12.5h-1.313c-.724 0-1.312.588-1.312 1.313v9.624c0 .725.588 1.313 1.312 1.313h9.625zm-.164-1.313h-9.296a.164.164 0 01-.165-.164v-8.148h9.625v8.148c0 .091-.073.164-.164.164zm-5.336-1.626l3.891-3.86a.328.328 0 00.002-.464l-.616-.621a.328.328 0 00-.464-.002l-3.037 3.013-1.206-1.216a.328.328 0 00-.464-.002l-.621.616a.328.328 0 00-.002.464l2.053 2.07c.128.129.335.13.464.002z"
        fill={props.color}
        fillRule="nonzero"
      />
    </g>
  </svg>
);

ScheduledSVG.defaultProps = {
  width: 35,
  height: 35,
  color: '#FF3366',
};

ScheduledSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
