import PropTypes from 'prop-types';
import React from 'react';

export const DownloadFilledSVG = props => (
  <svg width={props.width} height={props.height} {...props}>
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-319.000000, -574.000000)" fill={props.color}>
        <g transform="translate(319.000000, 574.000000)">
          <circle fillOpacity="0.1" cx="13" cy="13" r="13" />
          <path d="M12.7292058,18.1679672 L17.6370157,13.2601572 C17.7471534,13.1500195 17.7471534,12.9718812 17.6370157,12.8617207 L17.172936,12.3976638 C17.0627983,12.2875033 16.88466,12.2875033 16.7744995,12.3976638 L13.139361,16.0328252 L13.139361,8.03127258 C13.139361,7.8765946 13.0127897,7.75002325 12.8581117,7.75002325 L12.2018633,7.75002325 C12.0471853,7.75002325 11.9206139,7.8765946 11.9206139,8.03127258 L11.9206139,16.0328252 L8.28547551,12.3976638 C8.17531494,12.2875033 7.99717663,12.2875033 7.88703896,12.3976638 L7.42295925,12.8617207 C7.31282158,12.9718812 7.31282158,13.1500195 7.42295925,13.2601572 L12.3307692,18.1679672 C12.4409298,18.2781277 12.6190452,18.2781277 12.7292058,18.1679672 Z" fillRule="nonzero" />
        </g>
      </g>
    </g>
  </svg>
);

DownloadFilledSVG.defaultProps = {
  width: 16,
  height: 16,
  color: '#F36',
};

DownloadFilledSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
