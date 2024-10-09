import PropTypes from 'prop-types';
import React from 'react';

export const BulkUploadSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
        <g transform="translate(-796.000000, -294.000000)" stroke={props.color} strokeWidth="1.5">
          <g transform="translate(503.000000, 277.000000)">
            <g>
              <g transform="translate(294.000000, 16.000000)">
                <g transform="translate(0.000000, 2.000000)">
                  <path d="M5.9476,14.4670316 L0.961,14.4670316 C0.6134,14.4670316 0.3306,14.1801095 0.3306,13.8270989 L0.3306,0.987149474 C0.3306,0.633802105 0.6134,0.346677895 0.961,0.346677895 L3.33946667,0.346677895 C3.6868,0.346677895 4.29806667,1.72092632 4.29806667,1.72092632 L15.0208,1.72092632 C15.3681333,1.72092632 15.6509333,2.00811789 15.6509333,2.36139789 L15.6509333,13.8271663 C15.6509333,14.1801768 15.3681333,14.4670989 15.0208,14.4670989 L10.6472667,14.4670989" />
                  <line x1="15.6508667" y1="4.39599158" x2="0.3306" y2="4.39599158" />
                  <line x1="8.33133333" y1="7.01433263" x2="8.33133333" y2="15.8734821" />
                  <polyline points="5.97633333 9.39405474 8.33133333 7.01433263 10.6863333 9.39405474" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  </React.Fragment>
);

BulkUploadSVG.defaultProps = {
  width: 18,
  height: 18,
  color: '#000000',
};

BulkUploadSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
