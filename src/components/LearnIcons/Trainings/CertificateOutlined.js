import React from 'react';
import PropTypes from 'prop-types';

export const CertificateOutlinedSVG = ({ width, height, color }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.12504 17.4166H11.875C15.8334 17.4166 17.4167 15.8333 17.4167 11.8749V7.12492C17.4167 3.16659 15.8334 1.58325 11.875 1.58325H7.12504C3.16671 1.58325 1.58337 3.16659 1.58337 7.12492V11.8749C1.58337 15.8333 3.16671 17.4166 7.12504 17.4166Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.3831 6.7561L10.9782 7.68531C11.0722 7.83148 11.281 7.97764 11.4376 8.01941L12.5026 8.29086C13.1603 8.45791 13.3378 9.0217 12.9097 9.54373L12.2102 10.3894C12.1058 10.5251 12.0223 10.7653 12.0327 10.9323L12.0954 12.0286C12.1371 12.7072 11.6569 13.0518 11.0304 12.8012L10.0073 12.394C9.85065 12.3314 9.58963 12.3314 9.43302 12.394L8.40984 12.8012C7.78341 13.0518 7.30314 12.6968 7.3449 12.0286L7.40755 10.9323C7.41799 10.7653 7.33446 10.5147 7.23006 10.3894L6.53054 9.54373C6.10247 9.0217 6.27996 8.45791 6.93772 8.29086L8.00266 8.01941C8.16971 7.97764 8.37852 7.82104 8.46205 7.68531L9.05716 6.7561C9.43302 6.1923 10.0177 6.1923 10.3831 6.7561Z"
      stroke={color}
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

CertificateOutlinedSVG.defaultProps = {
  width: 19,
  height: 19,
  color: '#292D32',
};

CertificateOutlinedSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
