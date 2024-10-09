import React from 'react';
import PropTypes from 'prop-types';

export const UploadImageSVG = props => (
  <svg
    width={props.width}
    height={props.height}
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.02 3H16V0.98C16 0.44 15.56 0 15.02 0H14.99C14.44 0 14 0.44 14 0.98V3H11.99C11.45 3 11.01 3.44 11 3.98V4.01C11 4.56 11.44 5 11.99 5H14V7.01C14 7.55 14.44 8 14.99 7.99H15.02C15.56 7.99 16 7.55 16 7.01V5H18.02C18.56 5 19 4.56 19 4.02V3.98C19 3.44 18.56 3 18.02 3ZM13 7.01V6H11.99C11.46 6 10.96 5.79 10.58 5.42C10.21 5.04 10 4.54 10 3.98C10 3.62 10.1 3.29 10.27 3H2C0.9 3 0 3.9 0 5V17C0 18.1 0.9 19 2 19H14C15.1 19 16 18.1 16 17V8.72C15.7 8.89 15.36 9 14.98 9C13.89 8.99 13 8.1 13 7.01ZM12.96 17H3C2.59 17 2.35 16.53 2.6 16.2L4.58 13.57C4.79 13.29 5.2 13.31 5.4 13.59L7 16L9.61 12.52C9.81 12.26 10.2 12.25 10.4 12.51L13.35 16.19C13.61 16.52 13.38 17 12.96 17Z"
      fill={props.color}
    />
  </svg>
);

UploadImageSVG.defaultProps = {
  width: 19,
  height: 19,
  color: '#5C5C5C',
};

UploadImageSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
