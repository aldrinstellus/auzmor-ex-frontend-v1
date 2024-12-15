import PropTypes from 'prop-types';
import React from 'react';

export const NotificationActiveSVG = props => (
  <React.Fragment>
    <svg height={props.height} width={props.width} viewBox="0 0 23 25" {...props}>
      <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
        <g transform="translate(-1247.000000, -3.000000)" fillRule="nonzero">
          <g>
            <g>
              <g transform="translate(1248.000000, 4.000000)">
                <g stroke="#000000" strokeLinecap="round" strokeWidth="1.5">
                  <g>
                    <g>
                      <g>
                        <path d="M19.857284,16.147 C18.7190123,14.9196 16.2510617,11.6463 16.4528395,6.4959 C16.5722469,3.4503 14.9435062,1.8358 13.285037,0.9826 C11.1915062,-0.0943 8.68474074,-0.0943 6.59120988,0.9826 C4.93264198,1.8357 3.30390123,3.4502 3.42330864,6.4958 C3.62518519,11.6463 1.15723457,14.9196 0.018962963,16.1469" />
                        <path d="M19.857284,16.147 C14.448,20.6088 5.42123457,20.6031 0.018962963,16.147" />
                      </g>
                      <path d="M7.70479012,21.0372 C7.70479012,22.0221 8.70666667,22.8234 9.93777778,22.8234 C11.1693827,22.8234 12.171358,22.0221 12.171358,21.0372" />
                    </g>
                  </g>
                </g>
                <circle stroke="#FFFFFF" strokeWidth={3} fill={props.color} cx={16} cy={5} r="4.5" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  </React.Fragment>
);

NotificationActiveSVG.defaultProps = {
  width: 23,
  height: 25,
  color: '#F36',
};

NotificationActiveSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
