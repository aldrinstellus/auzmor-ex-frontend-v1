import React from 'react';
import PropTypes from 'prop-types';

export const DownloadIconSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 11V13H1V11H0V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14H11C11.2652 14 11.5196 13.8946 11.7071 13.7071C11.8946 13.5196 12 13.2652 12 13V11H11ZM11 6L10.295 5.295L6.5 9.085V0H5.5V9.085L1.705 5.295L1 6L6 11L11 6Z" fill={props.color} />
    </svg>
  </React.Fragment>
);

DownloadIconSVG.defaultProps = {
  width: 22,
  height: 24,
  color: '#FF3366',
};

DownloadIconSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
