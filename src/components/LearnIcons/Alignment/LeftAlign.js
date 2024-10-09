import React from 'react';
import PropTypes from 'prop-types';

export const LeftAlignSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 24 24" fill={props.color}><path d="M0 0h24v24H0V0z" fill="none" /><path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" />
    </svg>
  </React.Fragment>
);

LeftAlignSVG.defaultProps = {
  width: 24,
  height: 24,
  color: 'black',
};

LeftAlignSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
