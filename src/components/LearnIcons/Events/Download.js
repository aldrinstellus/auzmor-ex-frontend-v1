import React from 'react';
import PropTypes from 'prop-types';

export const DownloadSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="none" fillRule="evenodd">
        <path d="M-4-4h24v24H-4z" />
        <path
          d="M8.532 16.495l7.771-7.77a.446.446 0 000-.631l-.735-.735a.446.446 0 00-.63 0l-5.756 5.755V.445C9.182.2 8.982 0 8.736 0H7.697c-.245 0-.445.2-.445.445v12.67L1.496 7.358a.446.446 0 00-.63 0l-.735.735a.446.446 0 000 .63l7.77 7.771a.446.446 0 00.631 0z"
          fill={props.color}
          fillRule="nonzero"
          opacity={0.7}
        />
      </g>
    </svg>
  </React.Fragment>
);

DownloadSVG.defaultProps = {
  width: 15,
  height: 16,
  color: '#000',
};

DownloadSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
