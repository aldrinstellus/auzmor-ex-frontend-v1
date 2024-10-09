import PropTypes from 'prop-types';
import React from 'react';

export const CamSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g
          transform="translate(-1016.000000, -153.000000)"
          fill={props.stroke ? '#fff' : props.color}
          stroke={props.color}
          strokeWidth={props.stroke}
        >
          <g transform="translate(1012.000000, 147.000000)">
            <path d="M13.536,7 C14.207,7 14.75,7.544 14.75,8.214 L14.75,8.214 L14.75,15.536 C14.75,16.207 14.206,16.75 13.536,16.75 L13.536,16.75 L6.214,16.75 C5.543,16.75 5,16.206 5,15.536 L5,15.536 L5,8.214 C5,7.543 5.544,7 6.214,7 L6.214,7 Z M17.783,8.14522141 C18.324,7.77522141 19.063,8.15522141 19.063,8.80022141 L19.063,8.80022141 L19.063,15.3232214 C19.063,15.9712214 18.322,16.3482214 17.783,15.9782214 L17.783,15.9782214 L15,14.0612214 L15,10.0652214 Z" />
          </g>
        </g>
      </g>
    </svg>
  </React.Fragment>
);

CamSVG.defaultProps = {
  width: 16,
  height: 16,
  stroke: 0,
  color: '#5E6167',
};

CamSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  stroke: PropTypes.number,
  color: PropTypes.string,
};
