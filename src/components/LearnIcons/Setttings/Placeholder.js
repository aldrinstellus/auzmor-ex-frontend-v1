import React from 'react';
import PropTypes from 'prop-types';

export const PlaceholderSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 32 24" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M3.42857 0H28.5714C30.465 0 32 1.61177 32 3.6V20.4C32 22.3882 30.465 24 28.5714 24H3.42857C1.53502 24 0 22.3882 0 20.4V3.6C0 1.61177 1.53502 0 3.42857 0ZM22.5222 6.35166L29.7142 13.9032H29.7143V3.60005C29.7143 2.93728 29.2026 2.40002 28.5714 2.40002H3.42852C2.79732 2.40002 2.28564 2.93728 2.28564 3.60005V16.3032L6.0491 12.3516C6.49535 11.8831 7.21883 11.8831 7.66508 12.3516L11.4285 16.3032L20.9063 6.35166C21.3525 5.88317 22.076 5.88317 22.5222 6.35166Z" fill="#6D7278" fillOpacity="0.2838" />
      <path d="M10.2855 11.9998C12.1791 11.9998 13.7141 10.388 13.7141 8.3998C13.7141 6.41158 12.1791 4.7998 10.2855 4.7998C8.39196 4.7998 6.85693 6.41158 6.85693 8.3998C6.85693 10.388 8.39196 11.9998 10.2855 11.9998Z" fill="#D9DADC" />
    </svg>

  </React.Fragment>
);

PlaceholderSVG.defaultProps = {
  width: 32,
  height: 24,
};

PlaceholderSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
