import React from 'react';
import PropTypes from 'prop-types';

export const UploadOulinedSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} {...props}>
      <g fill={props.color} fillRule="nonzero">
        <path d="M13.828 9.16v4.072a.587.587 0 01-.586.586H1.758a.587.587 0 01-.586-.586V9.159H0v4.073c0 .969.789 1.758 1.758 1.758h11.484A1.76 1.76 0 0015 13.232V9.159h-1.172z" />
        <path d="M7.5.01L3.859 3.652l.829.828 2.226-2.226v9.132h1.172V2.254l2.226 2.226.83-.828z" />
      </g>
    </svg>
  </React.Fragment>
);

UploadOulinedSVG.defaultProps = {
  width: 15,
  height: 15,
  color: '#F36',
};

UploadOulinedSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
