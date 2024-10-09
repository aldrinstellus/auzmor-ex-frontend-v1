import React from 'react';
import PropTypes from 'prop-types';

export const ActivitySVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 19 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 9.19H3.96L6.9 5.27L10.5 11.5L13.1 1.5L15.13 9.04H17.5" stroke={props.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </React.Fragment>
);

ActivitySVG.defaultProps = {
  width: 19,
  height: 13,
  color: '#FF3366',
};

ActivitySVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
