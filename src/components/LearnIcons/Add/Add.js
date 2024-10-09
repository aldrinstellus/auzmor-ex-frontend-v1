import PropTypes from 'prop-types';
import React from 'react';

export const AddSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 18 18" fill="none" {...props}>
      <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
        <g transform="translate(-345.000000, -7559.000000)">
          <g transform="translate(342.000000, 7556.000000)">
            <polygon points="0 0 24 0 24 24 0 24" />
            <path d="M11.875,3 C7.18057963,3 3.375,6.80557963 3.375,11.5 C3.375,16.1944204 7.18057963,20 11.875,20 C16.5694204,20 20.375,16.1944204 20.375,11.5 C20.375,9.24565984 19.4794669,7.08365158 17.8854076,5.48959236 C16.2913484,3.89553314 14.1293402,3 11.875,3 Z M15.275,11.925 C15.275,12.159721 15.084721,12.35 14.85,12.35 L12.725,12.35 L12.725,14.475 C12.725,14.709721 12.534721,14.9 12.3,14.9 L11.45,14.9 C11.215279,14.9 11.025,14.709721 11.025,14.475 L11.025,12.35 L8.9,12.35 C8.66527898,12.35 8.475,12.159721 8.475,11.925 L8.475,11.075 C8.475,10.840279 8.66527898,10.65 8.9,10.65 L11.025,10.65 L11.025,8.525 C11.025,8.29027898 11.215279,8.1 11.45,8.1 L12.3,8.1 C12.534721,8.1 12.725,8.29027898 12.725,8.525 L12.725,10.65 L14.85,10.65 C15.084721,10.65 15.275,10.840279 15.275,11.075 L15.275,11.925 Z" id="AddShape" fill={props.color} fillRule="nonzero" />
          </g>
        </g>
      </g>
    </svg>
  </React.Fragment>
);

AddSVG.defaultProps = {
  width: 21,
  height: 21,
  color: '#FF3366',
};

AddSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
