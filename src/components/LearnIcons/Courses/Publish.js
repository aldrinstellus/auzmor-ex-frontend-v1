import PropTypes from 'prop-types';
import React from 'react';

export const CoursePublishSVG = props => (
  <svg width={props.width} height={props.height} viewBox="0 0 15 15" {...props}>
    <g stroke="none" strokeWidth={1} fill="none" fillRule="evenodd">
      <g transform="translate(-256.000000, -7671.000000)">
        <g transform="translate(252.000000, 7667.000000)">
          <polygon points="0 0 24 0 24 24 0 24" />
          <path d="M17.9449776,4.09465139 C18.4518066,3.80168334 19.087553,4.22940525 18.9879324,4.82120643 L16.8785624,17.4774263 C16.8024022,17.9256617 16.3277882,18.1864147 15.9117679,18.0106338 L12.2613974,16.4813349 L10.4010503,18.7459722 C9.99089499,19.2469647 9.15593605,18.9744816 9.15593605,18.2830884 L9.15593605,15.9246956 L16.2135479,7.32608328 C16.3512199,7.15908576 16.1227106,6.93935973 15.9615782,7.08292551 L7.54461176,14.5008823 L4.4303671,13.1942276 C3.90302461,12.9715833 3.83564768,12.2332981 4.36590841,11.9285999 L17.9449776,4.09465139 Z" fill="#000000" fillRule="nonzero" />
        </g>
      </g>
    </g>
  </svg>
);

CoursePublishSVG.defaultProps = {
  width: 15,
  height: 15,
};

CoursePublishSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};
