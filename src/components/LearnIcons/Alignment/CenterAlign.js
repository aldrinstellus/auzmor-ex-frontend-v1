import React from 'react';
import PropTypes from 'prop-types';

export const CenterAlignSVG = props => (
  <React.Fragment>
    <svg width={props.width} height={props.height} viewBox="0 0 24 24" fill={props.color}><path d="M0 0h24v24H0V0z" fill="none" /><path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z" /></svg>
  </React.Fragment>
);

CenterAlignSVG.defaultProps = {
  width: 24,
  height: 24,
  color: 'black',
};

CenterAlignSVG.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
};
