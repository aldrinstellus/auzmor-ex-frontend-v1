import React from 'react';
import PropTypes from 'prop-types';

export const UnScheduledSVG = props => (
  <svg width={props.width} height={props.height} {...props}>
    <g fill="none" fillRule="evenodd">
      <circle fillOpacity={0.1} fill="#9B9B9B" cx={17.5} cy={17.5} r={17.5} />
      <path
        d="M21.937 24.75c.725 0 1.313-.588 1.313-1.313v-9.624c0-.725-.588-1.313-1.313-1.313h-1.312v-1.422a.33.33 0 00-.328-.328h-1.094a.33.33 0 00-.328.328V12.5h-3.5v-1.422a.33.33 0 00-.328-.328h-1.094a.33.33 0 00-.328.328V12.5h-1.313c-.724 0-1.312.588-1.312 1.313v9.624c0 .725.588 1.313 1.312 1.313h9.625zm-.164-1.313h-9.296a.165.165 0 01-.165-.164v-8.148h9.625v8.148c0 .09-.073.164-.164.164zm-4.32-1.312a.33.33 0 00.328-.328v-2.078h2.078a.33.33 0 00.328-.328v-.657a.33.33 0 00-.328-.328h-2.078v-2.078a.33.33 0 00-.328-.328h-.656a.33.33 0 00-.328.328v2.078H14.39a.33.33 0 00-.329.328v.657c0 .18.148.328.329.328h2.078v2.078c0 .18.147.328.328.328h.656z"
        fill="#000"
        fillRule="nonzero"
      />
    </g>
  </svg>
);

UnScheduledSVG.defaultProps = {
  width: 35,
  height: 35,
};

UnScheduledSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
