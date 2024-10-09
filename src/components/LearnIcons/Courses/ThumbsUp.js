import React from 'react';
import PropTypes from 'prop-types';

export const ThumbsUpSVG = props => (
  <React.Fragment>
    <svg
      width={props.width}
      height={props.height}
      viewBox="0 0 38 37"
      fill="none"
      {...props}
    >
      <path d="M34.212 20.6538H31.1602" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32.5397 25.6919H30.3477" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.9111 32.3548C19.784 35.411 30.3482 35.2228 30.3482 35.2228C34.4015 35.2228 33.5399 30.73 30.6097 30.73H29.4405" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.9111 17.1394C10.9111 17.1394 19.2768 10.5039 18.6767 3.56344C18.2214 -1.70173 27.9085 2.32494 22.5164 15.6156H34.4704C37.8048 15.6156 37.7949 20.6538 34.4704 20.6538H34.2122C37.5733 20.6538 37.4849 25.6919 34.2122 25.6919H32.5403C35.8737 25.6919 35.8648 30.7301 32.5403 30.7301L30.61 30.7299" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="1" y="15.5835" width="9.91071" height="20" fill={props.color} stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

ThumbsUpSVG.defaultProps = {
  width: 38,
  height: 37,
  color: '#F36',
};

ThumbsUpSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
